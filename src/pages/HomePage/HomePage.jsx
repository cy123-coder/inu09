import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Banner from '../../components/Banner/Banner.jsx';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter.jsx';
import PostCard from '../../components/PostCard/PostCard.jsx';
import { useAuth } from '../../hooks/AuthContext.jsx';
import useHomeData from '../../hooks/useHomeData.js';
import { isSupabaseConfigured } from '../../lib/supabaseClient.js';
import { getPreviewFavoriteIds, setPreviewFavorite } from '../../lib/formatters.js';
import { listMyFavorites, toggleFavorite } from '../../api/usedItems.js';
import { Button } from '../../components/Layout/Layout.styles.js';
import { Floating, Grid, Heading, ListingLayout, LoadMore, Notice, Tabs } from './HomePage.styles.js';

const kinds = [
  { key: 'all', label: '전체' }, { key: 'groupbuy', label: '공구' }, { key: 'used', label: '중고거래' },
];

export default function HomePage() {
  const { groupBuys, usedItems, banners, loading, error, refresh } = useHomeData();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState('전체');
  const [favoriteIds, setFavoriteIds] = useState(() => new Set(getPreviewFavoriteIds()));
  const [visible, setVisible] = useState(6);
  const kind = ['groupbuy', 'used'].includes(searchParams.get('kind')) ? searchParams.get('kind') : 'all';
  const query = searchParams.get('q') || '';

  useEffect(() => { setVisible(6); }, [kind, category, query]);
  useEffect(() => {
    let alive = true;
    if (!user || !isSupabaseConfigured) { setFavoriteIds(new Set(getPreviewFavoriteIds())); return undefined; }
    listMyFavorites().then((items) => { if (alive) setFavoriteIds(new Set(items.map((item) => item.id))); }).catch(() => {});
    return () => { alive = false; };
  }, [user]);

  const items = useMemo(() => {
    const all = [
      ...(kind !== 'used' ? groupBuys.map((item) => ({ item, kind: 'groupbuy' })) : []),
      ...(kind !== 'groupbuy' ? usedItems.map((item) => ({ item, kind: 'used' })) : []),
    ].sort((a, b) => new Date(b.item.created_at || 0) - new Date(a.item.created_at || 0));
    return all.filter(({ item }) => {
      const itemCategory = item.category_name ?? item.category ?? '기타';
      return (category === '전체' || itemCategory === category) && (!query || item.title.toLowerCase().includes(query.toLowerCase()));
    });
  }, [category, groupBuys, kind, query, usedItems]);

  const changeKind = (nextKind) => {
    const params = new URLSearchParams(searchParams);
    if (nextKind === 'all') params.delete('kind'); else params.set('kind', nextKind);
    setSearchParams(params);
  };

  const favorite = async (item) => {
    const preview = item.id.startsWith('demo-') || item.id.startsWith('preview-');
    if (!user && isSupabaseConfigured && !preview) { navigate(`/login?next=${encodeURIComponent('/home?kind=used')}`); return; }
    const wasFavorite = favoriteIds.has(item.id);
    setFavoriteIds((current) => { const next = new Set(current); if (wasFavorite) next.delete(item.id); else next.add(item.id); return next; });
    if (isSupabaseConfigured && !preview) {
      try { await toggleFavorite(item.id, wasFavorite); await refresh(); }
      catch (cause) { setFavoriteIds((current) => { const next = new Set(current); if (wasFavorite) next.add(item.id); else next.delete(item.id); return next; }); window.alert(cause.message); }
    } else setPreviewFavorite(item.id, !wasFavorite);
  };

  return <>
    <Banner banners={banners} />
    <Heading><div><span className="eyebrow">INU STUDENT MARKET</span><h2>{kind === 'groupbuy' ? '함께 사는 공구' : kind === 'used' ? '이웃의 중고거래' : '지금 올라온 공고'}</h2><p>인천대 이웃과 함께 나누는 알뜰한 거래를 찾아보세요.</p></div><Button $yellow as={Link} to={user || !isSupabaseConfigured ? '/new' : '/login?next=%2Fnew'}>+ 공고 올리기</Button></Heading>
    <Tabs aria-label="공고 종류">{kinds.map((tab) => <button key={tab.key} type="button" aria-pressed={kind === tab.key} onClick={() => changeKind(tab.key)}>{tab.label}</button>)}</Tabs>
    <ListingLayout><div className="filters"><CategoryFilter value={category} onChange={setCategory} /></div><div className="content"><div className="content-head"><span>공고 <b>{items.length}</b>개</span><span>최신순 ↓</span></div>
      {error && <Notice>{error}<br />설정된 Supabase 프로젝트와 마이그레이션을 확인해 주세요.</Notice>}
      {loading && <Notice>공고를 불러오고 있어요…</Notice>}
      {!loading && items.length === 0 && <Notice>{query ? '검색 결과가 없어요. 다른 키워드로 찾아보세요.' : '아직 공고가 없어요. 첫 공고를 올려보세요!'}</Notice>}
      <Grid>{items.slice(0, visible).map(({ item, kind: itemKind }) => <PostCard key={`${itemKind}-${item.id}`} item={(!isSupabaseConfigured || item.id.startsWith('demo-') || item.id.startsWith('preview-')) && itemKind === 'used' && favoriteIds.has(item.id) ? { ...item, favorite_count: (item.favorite_count || 0) + 1 } : item} kind={itemKind} isFavorite={favoriteIds.has(item.id)} onFavorite={favorite} />)}</Grid>
      {items.length > visible && <LoadMore onClick={() => setVisible((count) => count + 6)}>공고 더 보기　↓</LoadMore>}
    </div></ListingLayout>
    <Floating type="button" onClick={() => navigate(user || !isSupabaseConfigured ? '/new' : '/login?next=%2Fnew')}>＋ 공고 올리기</Floating>
  </>;
}
