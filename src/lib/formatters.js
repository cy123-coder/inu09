export const formatWon = (value) => `${Number(value ?? 0).toLocaleString('ko-KR')}원`;
const categorySlugs = { 식품: 'food', 생활: 'daily', 전공책: 'textbook', 전자기기: 'digital', 의류: 'clothes', 기타: 'other' };
export const categoryId = (name, kind) => `${kind}-${categorySlugs[name] || 'other'}`;
export const formatDate = (value) => value ? new Date(value).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }) : '날짜 미정';
export const timeAgo = (value) => {
  if (!value) return '';
  const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}시간 전`;
  return `${Math.floor(minutes / 1440)}일 전`;
};

export const demoGroupBuys = [
  { id: 'demo-g1', title: '두꺼운 두루마리 휴지 30롤', description: '넉넉한 대용량 휴지를 같이 사서 나눠요. 인천대 정문에서 전달할게요.', category: '생활', category_id: '생활', images: [], min_participants: 8, max_participants: 100, current_participants: 8, total_price: 120000, price_per_person: 1200, pickup_place: '인천대학교 정문', deadline: new Date(Date.now() + 86400000 * 4).toISOString(), status: 'open', created_at: new Date(Date.now() - 1000 * 60 * 9).toISOString(), profiles: { nickname: '공구하는 고래' } },
  { id: 'demo-g2', title: '아이패드 필기용 펜촉 공동구매', description: '정품 호환 펜촉이에요. 여럿이 묶음으로 사면 배송비가 절약돼요.', category: '전자기기', category_id: '전자기기', images: [], min_participants: 3, max_participants: 12, current_participants: 7, total_price: 36000, price_per_person: 3000, pickup_place: '학생회관 앞', deadline: new Date(Date.now() + 86400000 * 2).toISOString(), status: 'open', created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), profiles: { nickname: '민트초코' } },
  { id: 'demo-g3', title: '시험 기간 간식 박스 같이 사요', description: '과방에서 함께 먹을 간식 박스를 나눠 구매합니다.', category: '식품', category_id: '식품', images: [], min_participants: 5, max_participants: 20, current_participants: 20, total_price: 60000, price_per_person: 3000, pickup_place: '도서관 로비', deadline: new Date(Date.now() - 86400000).toISOString(), status: 'filled', created_at: new Date(Date.now() - 86400000).toISOString(), profiles: { nickname: '과자연구회' } },
  { id: 'demo-g4', title: '전공 원서 번역본 묶음 공동구매', description: '이번 학기 수업에서 쓰는 교재를 같이 주문해요.', category: '전공책', category_id: '전공책', images: [], min_participants: 2, max_participants: 8, current_participants: 3, total_price: 128000, price_per_person: 16000, pickup_place: '송도캠퍼스', deadline: new Date(Date.now() + 86400000 * 5).toISOString(), status: 'open', created_at: new Date(Date.now() - 86400000).toISOString(), profiles: { nickname: '책벌레' } },
  { id: 'demo-g5', title: '텀블러 세척솔 여러 개 나눠요', description: '주방용품 묶음 배송으로 같이 구매해요. 새 제품입니다.', category: '생활', category_id: '생활', images: [], min_participants: 4, max_participants: 10, current_participants: 6, total_price: 30000, price_per_person: 3000, pickup_place: '복지회관', deadline: new Date(Date.now() + 86400000 * 3).toISOString(), status: 'open', created_at: new Date(Date.now() - 86400000 * 2).toISOString(), profiles: { nickname: '송도살이' } },
];

export const demoUsedItems = [
  { id: 'demo-u1', title: '미적분학 개정판 (필기 없음)', description: '깨끗하게 보관한 교재입니다. 학기 시작 전 저렴하게 가져가세요.', category: '전공책', category_id: '전공책', images: [], price: 8000, condition: '좋음', place: '도서관 앞', status: 'selling', favorite_count: 3, created_at: new Date(Date.now() - 7200000).toISOString(), profiles: { nickname: '수학하는 곰' } },
  { id: 'demo-u2', title: '무선 키보드 팝니다', description: '블루투스 키보드예요. 사용감 적고 정상 작동합니다.', category: '전자기기', category_id: '전자기기', images: [], price: 18000, condition: '좋음', place: '학생회관', status: 'selling', favorite_count: 5, created_at: new Date(Date.now() - 14400000).toISOString(), profiles: { nickname: '키보드덕후' } },
  { id: 'demo-u3', title: '봄 자켓 M 사이즈', description: '몇 번 입지 않은 자켓이에요. 직접 보고 거래해도 괜찮아요.', category: '의류', category_id: '의류', images: [], price: 15000, condition: '매우 좋음', place: '인천대입구역', status: 'reserved', favorite_count: 2, created_at: new Date(Date.now() - 86400000).toISOString(), profiles: { nickname: '봄봄' } },
  { id: 'demo-u4', title: '공학용 계산기 함께 쓸 분', description: '수업에 필요한 공학용 계산기입니다. 작동 잘 돼요.', category: '전자기기', category_id: '전자기기', images: [], price: 22000, condition: '좋음', place: '기숙사 입구', status: 'selling', favorite_count: 1, created_at: new Date(Date.now() - 86400000 * 2).toISOString(), profiles: { nickname: '공대생' } },
  { id: 'demo-u5', title: '머그컵 세트 새 상품', description: '선물 받은 머그컵 세트예요. 포장 그대로 보관 중입니다.', category: '기타', category_id: '기타', images: [], price: 10000, condition: '새 상품', place: '송도캠퍼스', status: 'selling', favorite_count: 4, created_at: new Date(Date.now() - 86400000 * 3).toISOString(), profiles: { nickname: '하얀머그' } },
];

export const demoBanners = [
  { id: 'welcome', title: '같이 사면 더 싸다', subtitle: '이번 주 공구 열렸어요', image_url: '', link_url: '/home?kind=groupbuy', active: true },
  { id: 'nearby', title: '필요한 만큼, 가까운 이웃과', subtitle: '09INU에서 알뜰하게 나눠요', image_url: '', link_url: '/new', active: true },
];

export function getPreviewPosts() {
  try { return JSON.parse(window.localStorage.getItem('09inu-preview-posts') || '[]'); }
  catch { return []; }
}

export function savePreviewPost(post) {
  const posts = getPreviewPosts();
  window.localStorage.setItem('09inu-preview-posts', JSON.stringify([post, ...posts]));
}

function readPreviewState() {
  try { return JSON.parse(window.localStorage.getItem('09inu-preview-state') || '{"joins":[],"favorites":[]}'); }
  catch { return { joins: [], favorites: [] }; }
}

function writePreviewState(state) {
  window.localStorage.setItem('09inu-preview-state', JSON.stringify(state));
}

export function getPreviewParticipation(id) { return readPreviewState().joins.includes(id); }
export function setPreviewParticipation(id, joined) {
  const state = readPreviewState();
  state.joins = joined ? [...new Set([...state.joins, id])] : state.joins.filter((entry) => entry !== id);
  writePreviewState(state);
}
export function getPreviewFavoriteIds() { return readPreviewState().favorites; }
export function setPreviewFavorite(id, favorite) {
  const state = readPreviewState();
  state.favorites = favorite ? [...new Set([...state.favorites, id])] : state.favorites.filter((entry) => entry !== id);
  writePreviewState(state);
}

export function getPreviewGroupBuys() {
  return [...getPreviewPosts().filter((item) => item.type === 'groupbuy'), ...demoGroupBuys].map((item) => {
    const joined = getPreviewParticipation(item.id);
    return { ...item, current_participants: Math.max(0, item.current_participants + (joined ? 1 : 0)) };
  });
}

export function getPreviewUsedItems() {
  return [...getPreviewPosts().filter((item) => item.type === 'used'), ...demoUsedItems].map((item) => {
    return { ...item };
  });
}
