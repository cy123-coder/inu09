import { requireSupabase } from '../lib/supabaseClient.js';

export async function listGroupBuys({ categoryId, search, limit = 30 } = {}) {
  let query = requireSupabase().from('group_buys_with_counts').select('*').order('created_at', { ascending: false }).limit(limit);
  if (categoryId) query = query.eq('category_id', categoryId);
  if (search) query = query.ilike('title', `%${search}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getGroupBuy(id) {
  const { data, error } = await requireSupabase().from('group_buys_with_counts').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createGroupBuy(input) {
  const db = requireSupabase();
  const { data: { user } } = await db.auth.getUser();
  if (!user) throw new Error('로그인이 필요해요.');
  const { data, error } = await db.from('group_buys').insert({ ...input, author_id: user.id }).select().single();
  if (error) throw error;
  return data;
}

export async function updateGroupBuy(id, changes) {
  const { data, error } = await requireSupabase().from('group_buys').update(changes).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteGroupBuy(id) {
  const { error } = await requireSupabase().from('group_buys').delete().eq('id', id);
  if (error) throw error;
}

export async function joinGroupBuy(id) {
  const { data, error } = await requireSupabase().rpc('join_group_buy', { p_group_buy_id: id });
  if (error) throw error;
  return data;
}

export async function leaveGroupBuy(id) {
  const { data, error } = await requireSupabase().rpc('leave_group_buy', { p_group_buy_id: id });
  if (error) throw error;
  return data;
}

export async function getParticipationState(id) {
  const db = requireSupabase();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return false;
  const { data, error } = await db.from('participations').select('id').eq('group_buy_id', id).eq('user_id', user.id).maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function listMyParticipations() {
  const db = requireSupabase();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return [];
  const { data: participationRows, error: participationError } = await db.from('participations').select('group_buy_id, created_at').eq('user_id', user.id).order('created_at', { ascending: false });
  if (participationError) throw participationError;
  const ids = participationRows.map((row) => row.group_buy_id);
  if (!ids.length) return [];
  const { data, error } = await db.from('group_buys_with_counts').select('*').in('id', ids);
  if (error) throw error;
  const order = new Map(ids.map((id, index) => [id, index]));
  return data.sort((a, b) => order.get(a.id) - order.get(b.id));
}

export async function listMyGroupBuys() {
  const db = requireSupabase();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return [];
  const { data, error } = await db.from('group_buys_with_counts').select('*').eq('author_id', user.id).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export function subscribeToGroupBuyChanges(onChange) {
  return requireSupabase().channel('group-buy-list')
    .on('broadcast', { event: 'group-buy-updated' }, onChange)
    .subscribe();
}
