insert into public.categories(id, name, kind) values
  ('groupbuy-food', '식품', 'groupbuy'), ('groupbuy-daily', '생활', 'groupbuy'),
  ('groupbuy-textbook', '전공책', 'groupbuy'), ('groupbuy-digital', '전자기기', 'groupbuy'),
  ('groupbuy-clothes', '의류', 'groupbuy'), ('groupbuy-other', '기타', 'groupbuy'),
  ('used-food', '식품', 'used'), ('used-daily', '생활', 'used'),
  ('used-textbook', '전공책', 'used'), ('used-digital', '전자기기', 'used'),
  ('used-clothes', '의류', 'used'), ('used-other', '기타', 'used')
on conflict (id) do update set name = excluded.name, kind = excluded.kind;

insert into public.banners(id, title, subtitle, link_url, display_order, active) values
  ('091a0000-0000-4000-8000-000000000001', '같이 사면 더 싸다', '이번 주 공구 열렸어요', '/home?kind=groupbuy', 1, true),
  ('091a0000-0000-4000-8000-000000000002', '필요한 만큼, 가까운 이웃과', '09INU에서 알뜰하게 나눠요', '/new', 2, true)
on conflict (id) do update set title = excluded.title, subtitle = excluded.subtitle,
  link_url = excluded.link_url, display_order = excluded.display_order, active = excluded.active;

-- Public starter listings have a null author so no fake student account is created.
insert into public.group_buys(id, title, description, category_id, min_participants, max_participants,
  total_price, price_per_person, pickup_place, deadline, status, created_at) values
  ('091a1000-0000-4000-8000-000000000001', '두꺼운 두루마리 휴지 30롤', '넉넉한 대용량 휴지를 같이 사서 나눠요. 인천대 정문에서 전달할게요.', 'groupbuy-daily', 8, 100, 120000, 1200, '인천대학교 정문', now() + interval '4 days', 'open', now() - interval '9 minutes'),
  ('091a1000-0000-4000-8000-000000000002', '아이패드 필기용 펜촉 공동구매', '정품 호환 펜촉이에요. 여럿이 묶음으로 사면 배송비가 절약돼요.', 'groupbuy-digital', 3, 12, 36000, 3000, '학생회관 앞', now() + interval '2 days', 'open', now() - interval '1 hour'),
  ('091a1000-0000-4000-8000-000000000003', '시험 기간 간식 박스 같이 사요', '과방에서 함께 먹을 간식 박스를 나눠 구매합니다.', 'groupbuy-food', 5, 20, 60000, 3000, '도서관 로비', now() + interval '2 days', 'open', now() - interval '4 hours'),
  ('091a1000-0000-4000-8000-000000000004', '전공 원서 번역본 묶음 공동구매', '이번 학기 수업에서 쓰는 교재를 같이 주문해요.', 'groupbuy-textbook', 2, 8, 128000, 16000, '송도캠퍼스', now() + interval '5 days', 'open', now() - interval '1 day'),
  ('091a1000-0000-4000-8000-000000000005', '텀블러 세척솔 여러 개 나눠요', '주방용품 묶음 배송으로 같이 구매해요. 새 제품입니다.', 'groupbuy-daily', 4, 10, 30000, 3000, '복지회관', now() + interval '3 days', 'open', now() - interval '2 days')
on conflict (id) do nothing;

insert into public.used_items(id, title, description, category_id, price, condition, place, status, created_at) values
  ('091a2000-0000-4000-8000-000000000001', '미적분학 개정판 (필기 없음)', '깨끗하게 보관한 교재입니다. 학기 시작 전 저렴하게 가져가세요.', 'used-textbook', 8000, '좋음', '도서관 앞', 'selling', now() - interval '2 hours'),
  ('091a2000-0000-4000-8000-000000000002', '무선 키보드 팝니다', '블루투스 키보드예요. 사용감 적고 정상 작동합니다.', 'used-digital', 18000, '좋음', '학생회관', 'selling', now() - interval '4 hours'),
  ('091a2000-0000-4000-8000-000000000003', '봄 자켓 M 사이즈', '몇 번 입지 않은 자켓이에요. 직접 보고 거래해도 괜찮아요.', 'used-clothes', 15000, '매우 좋음', '인천대입구역', 'reserved', now() - interval '1 day'),
  ('091a2000-0000-4000-8000-000000000004', '공학용 계산기 함께 쓸 분', '수업에 필요한 공학용 계산기입니다. 작동 잘 돼요.', 'used-digital', 22000, '좋음', '기숙사 입구', 'selling', now() - interval '2 days'),
  ('091a2000-0000-4000-8000-000000000005', '머그컵 세트 새 상품', '선물 받은 머그컵 세트예요. 포장 그대로 보관 중입니다.', 'used-other', 10000, '새 상품', '송도캠퍼스', 'selling', now() - interval '3 days')
on conflict (id) do nothing;
