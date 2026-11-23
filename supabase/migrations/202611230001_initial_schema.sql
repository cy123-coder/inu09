-- 09INU initial schema. Apply with `supabase db push` or the Supabase SQL editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null default 'INU 이웃' check (char_length(nickname) between 2 and 24),
  created_at timestamptz not null default now()
);
create table if not exists public.categories (
  id text primary key, name text not null,
  kind text not null check (kind in ('groupbuy', 'used')),
  unique (name, kind)
);
create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(), title text not null,
  subtitle text not null default '', image_url text,
  link_url text not null default '/home', display_order integer not null default 0,
  active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.group_buys (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete set null,
  title text not null check (char_length(title) between 2 and 100),
  description text not null default '', images text[] not null default '{}',
  category_id text not null references public.categories(id),
  min_participants integer not null default 1 check (min_participants > 0),
  max_participants integer not null check (max_participants > 0 and max_participants >= min_participants),
  total_price bigint not null check (total_price > 0),
  price_per_person bigint not null check (price_per_person > 0),
  pickup_place text not null, deadline timestamptz,
  status text not null default 'open' check (status in ('open', 'filled', 'closed')),
  created_at timestamptz not null default now()
);
create table if not exists public.participations (
  id uuid primary key default gen_random_uuid(),
  group_buy_id uuid not null references public.group_buys(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(), unique (group_buy_id, user_id)
);
create table if not exists public.used_items (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete set null,
  title text not null check (char_length(title) between 2 and 100),
  description text not null default '', images text[] not null default '{}',
  category_id text not null references public.categories(id),
  price bigint not null check (price >= 0), condition text not null default '좋음',
  place text not null, status text not null default 'selling' check (status in ('selling', 'reserved', 'sold')),
  created_at timestamptz not null default now()
);
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  used_item_id uuid not null references public.used_items(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(), unique (used_item_id, user_id)
);

create or replace function public.check_post_category_kind()
returns trigger language plpgsql set search_path = public
as $$
declare expected_kind text;
begin
  expected_kind := case when tg_table_name = 'group_buys' then 'groupbuy' else 'used' end;
  if not exists (select 1 from public.categories c where c.id = new.category_id and c.kind = expected_kind) then
    raise exception '공고 종류와 카테고리가 일치하지 않습니다.' using errcode = '23514';
  end if;
  return new;
end;
$$;
drop trigger if exists check_group_buy_category_kind on public.group_buys;
create trigger check_group_buy_category_kind before insert or update of category_id on public.group_buys
for each row execute function public.check_post_category_kind();
drop trigger if exists check_used_item_category_kind on public.used_items;
create trigger check_used_item_category_kind before insert or update of category_id on public.used_items
for each row execute function public.check_post_category_kind();
create index if not exists group_buys_latest_idx on public.group_buys(created_at desc);
create index if not exists group_buys_category_idx on public.group_buys(category_id, created_at desc);
create index if not exists used_items_latest_idx on public.used_items(created_at desc);
create index if not exists used_items_category_idx on public.used_items(category_id, created_at desc);
create index if not exists participations_user_idx on public.participations(user_id, created_at desc);
create index if not exists favorites_user_idx on public.favorites(user_id, created_at desc);

-- Enforce the campus domain in Auth and create/update a public nickname profile.
create or replace function public.handle_inu_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare chosen_nickname text;
begin
  if new.email is null or lower(new.email) !~ '@inu[.]ac[.]kr$' then
    raise exception '인천대학교 이메일(@inu.ac.kr)만 가입할 수 있습니다.' using errcode = 'check_violation';
  end if;
  chosen_nickname := coalesce(nullif(trim(new.raw_user_meta_data ->> 'nickname'), ''), split_part(new.email, '@', 1));
  insert into public.profiles(id, nickname) values (new.id, left(chosen_nickname, 24))
    on conflict (id) do update set nickname = excluded.nickname;
  return new;
end;
$$;
drop trigger if exists on_inu_auth_user_created on auth.users;
create trigger on_inu_auth_user_created after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.handle_inu_user();
insert into public.profiles(id, nickname)
select id, left(coalesce(nullif(trim(raw_user_meta_data ->> 'nickname'), ''), split_part(email, '@', 1)), 24)
from auth.users where lower(email) ~ '@inu[.]ac[.]kr$'
on conflict (id) do nothing;

-- Always calculate a rounded-up per-person estimate on the server.
create or replace function public.set_group_buy_price_per_person()
returns trigger language plpgsql set search_path = public
as $$
begin
  new.price_per_person := ceil(new.total_price::numeric / new.max_participants)::bigint;
  return new;
end;
$$;
drop trigger if exists group_buy_price_per_person on public.group_buys;
create trigger group_buy_price_per_person before insert or update of total_price, max_participants on public.group_buys
for each row execute function public.set_group_buy_price_per_person();

-- Author changes to the committed total and capacity stop once the first member joins.
create or replace function public.protect_group_buy_after_join()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    if exists (select 1 from public.participations p where p.group_buy_id = old.id) then
      raise exception '참여자가 있는 공구는 삭제할 수 없습니다.' using errcode = '23514';
    end if;
    return old;
  end if;
  if (new.total_price is distinct from old.total_price or new.max_participants is distinct from old.max_participants)
     and exists (select 1 from public.participations p where p.group_buy_id = old.id) then
    raise exception '참여가 시작된 뒤에는 총액과 정원을 바꿀 수 없습니다.' using errcode = '23514';
  end if;
  return new;
end;
$$;
drop trigger if exists protect_group_buy_after_join on public.group_buys;
create trigger protect_group_buy_after_join before update or delete on public.group_buys
for each row execute function public.protect_group_buy_after_join();

create or replace view public.group_buys_with_counts as
select gb.id, gb.author_id, gb.title, gb.description, gb.images, gb.category_id,
  gb.min_participants, gb.max_participants, gb.total_price, gb.price_per_person,
  gb.pickup_place, gb.deadline,
  case when gb.status <> 'closed' and gb.deadline is not null and gb.deadline <= now() then 'closed' else gb.status end as status,
  gb.created_at, c.name as category_name, p.nickname,
  coalesce(pc.current_participants, 0)::integer as current_participants,
  least(100, coalesce(pc.current_participants, 0)::numeric * 100 / nullif(gb.max_participants, 0)) as progress
from public.group_buys gb
join public.categories c on c.id = gb.category_id
left join public.profiles p on p.id = gb.author_id
left join (select group_buy_id, count(*) as current_participants from public.participations group by group_buy_id) pc on pc.group_buy_id = gb.id;

create or replace view public.used_items_with_counts as
select ui.*, c.name as category_name, p.nickname, coalesce(fc.favorite_count, 0)::integer as favorite_count
from public.used_items ui
join public.categories c on c.id = ui.category_id
left join public.profiles p on p.id = ui.author_id
left join (select used_item_id, count(*) as favorite_count from public.favorites group by used_item_id) fc on fc.used_item_id = ui.id;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.banners enable row level security;
alter table public.group_buys enable row level security;
alter table public.participations enable row level security;
alter table public.used_items enable row level security;
alter table public.favorites enable row level security;

drop policy if exists "profiles are public" on public.profiles;
create policy "profiles are public" on public.profiles for select using (true);
drop policy if exists "profile owner updates profile" on public.profiles;
create policy "profile owner updates profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists "categories are public" on public.categories;
create policy "categories are public" on public.categories for select using (true);
drop policy if exists "active banners are public" on public.banners;
create policy "active banners are public" on public.banners for select using (active = true);

drop policy if exists "group buys are public" on public.group_buys;
create policy "group buys are public" on public.group_buys for select using (true);
drop policy if exists "signed-in users create own group buys" on public.group_buys;
create policy "signed-in users create own group buys" on public.group_buys for insert to authenticated with check (author_id = auth.uid());
drop policy if exists "authors update group buys before participation" on public.group_buys;
create policy "authors update group buys before participation" on public.group_buys for update to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());
drop policy if exists "authors delete group buys without participants" on public.group_buys;
create policy "authors delete group buys without participants" on public.group_buys for delete to authenticated
  using (author_id = auth.uid());
drop policy if exists "users read own participations" on public.participations;
create policy "users read own participations" on public.participations for select to authenticated using (user_id = auth.uid());
revoke insert, update, delete on public.participations from anon, authenticated;

drop policy if exists "used items are public" on public.used_items;
create policy "used items are public" on public.used_items for select using (true);
drop policy if exists "signed-in users create own used items" on public.used_items;
create policy "signed-in users create own used items" on public.used_items for insert to authenticated with check (author_id = auth.uid());
drop policy if exists "authors update own used items" on public.used_items;
create policy "authors update own used items" on public.used_items for update to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());
drop policy if exists "authors delete own used items" on public.used_items;
create policy "authors delete own used items" on public.used_items for delete to authenticated using (author_id = auth.uid());

drop policy if exists "users read own favorites" on public.favorites;
create policy "users read own favorites" on public.favorites for select to authenticated using (user_id = auth.uid());
drop policy if exists "users create own favorites" on public.favorites;
create policy "users create own favorites" on public.favorites for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "users remove own favorites" on public.favorites;
create policy "users remove own favorites" on public.favorites for delete to authenticated using (user_id = auth.uid());

grant select on public.profiles, public.categories, public.banners, public.group_buys, public.group_buys_with_counts,
  public.used_items, public.used_items_with_counts to anon, authenticated;
grant insert, update, delete on public.group_buys, public.used_items to authenticated;
grant select, insert, delete on public.favorites to authenticated;
grant select on public.participations to authenticated;

create or replace function public.join_group_buy(p_group_buy_id uuid)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare gb public.group_buys%rowtype; participant_count integer;
begin
  if auth.uid() is null then raise exception '로그인이 필요합니다.' using errcode = '42501'; end if;
  select * into gb from public.group_buys where id = p_group_buy_id for update;
  if not found then raise exception '공구를 찾을 수 없습니다.' using errcode = 'P0002'; end if;
  if gb.author_id = auth.uid() then raise exception '작성자는 본인 공구에 참여할 수 없습니다.' using errcode = '23514'; end if;
  if gb.status = 'closed' or (gb.deadline is not null and gb.deadline <= now()) then raise exception '모집이 마감되었습니다.' using errcode = '23514'; end if;
  select count(*) into participant_count from public.participations where group_buy_id = p_group_buy_id;
  if participant_count >= gb.max_participants then
    update public.group_buys set status = 'filled' where id = p_group_buy_id;
    raise exception '모집 정원이 가득 찼습니다.' using errcode = '23514';
  end if;
  insert into public.participations(group_buy_id, user_id) values (p_group_buy_id, auth.uid());
  select count(*) into participant_count from public.participations where group_buy_id = p_group_buy_id;
  update public.group_buys set status = case when participant_count >= max_participants then 'filled' else 'open' end where id = p_group_buy_id;
  return jsonb_build_object('group_buy_id', p_group_buy_id, 'current_participants', participant_count,
    'status', case when participant_count >= gb.max_participants then 'filled' else 'open' end);
end;
$$;

create or replace function public.leave_group_buy(p_group_buy_id uuid)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare gb public.group_buys%rowtype; participant_count integer; deleted_count integer;
begin
  if auth.uid() is null then raise exception '로그인이 필요합니다.' using errcode = '42501'; end if;
  select * into gb from public.group_buys where id = p_group_buy_id for update;
  if not found then raise exception '공구를 찾을 수 없습니다.' using errcode = 'P0002'; end if;
  if gb.status = 'closed' or (gb.deadline is not null and gb.deadline <= now()) then raise exception '이미 마감된 공구입니다.' using errcode = '23514'; end if;
  delete from public.participations where group_buy_id = p_group_buy_id and user_id = auth.uid();
  get diagnostics deleted_count = row_count;
  if deleted_count = 0 then raise exception '참여 중인 공구가 아닙니다.' using errcode = 'P0002'; end if;
  select count(*) into participant_count from public.participations where group_buy_id = p_group_buy_id;
  update public.group_buys set status = 'open' where id = p_group_buy_id and status = 'filled';
  return jsonb_build_object('group_buy_id', p_group_buy_id, 'current_participants', participant_count, 'status', 'open');
end;
$$;
revoke all on function public.join_group_buy(uuid) from public, anon;
revoke all on function public.leave_group_buy(uuid) from public, anon;
grant execute on function public.join_group_buy(uuid), public.leave_group_buy(uuid) to authenticated;

-- Broadcast IDs only; clients re-read the counts through their RLS-protected views.
create or replace function public.broadcast_group_buy_change()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare changed_id uuid;
begin
  changed_id := coalesce(new.group_buy_id, old.group_buy_id);
  perform realtime.send(jsonb_build_object('group_buy_id', changed_id), 'group-buy-updated', 'group-buy-' || changed_id::text, false);
  perform realtime.send(jsonb_build_object('group_buy_id', changed_id), 'group-buy-updated', 'group-buy-list', false);
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;
drop trigger if exists broadcast_group_buy_participation on public.participations;
create trigger broadcast_group_buy_participation after insert or delete on public.participations
for each row execute function public.broadcast_group_buy_change();
drop policy if exists "authenticated users receive group buy count events" on realtime.messages;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('post-images', 'post-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = true, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif'];
drop policy if exists "post images are public" on storage.objects;
create policy "post images are public" on storage.objects for select using (bucket_id = 'post-images');
drop policy if exists "users upload images to own folder" on storage.objects;
create policy "users upload images to own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'post-images' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "users delete images from own folder" on storage.objects;
create policy "users delete images from own folder" on storage.objects for delete to authenticated
  using (bucket_id = 'post-images' and (storage.foldername(name))[1] = auth.uid()::text);
