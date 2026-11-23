import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listMyGroupBuys, listMyParticipations } from '../../api/groupbuys.js';
import { listMyFavorites, listMyUsedItems, toggleFavorite } from '../../api/usedItems.js';
import PostCard from '../../components/PostCard/PostCard.jsx';
import { Button, PageTitle } from '../../components/Layout/Layout.styles.js';
import { useAuth } from '../../hooks/AuthContext.jsx';
import { Grid, ActivityTabs, Empty, Summary } from './MyActivityPage.styles.js';

export default function MyActivityPage() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState('participating');
  const [data, setData] = useState({ participating: [], favorites: [], groupBuys: [], usedItems: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!user) { setLoading(false); return undefined; }
    let alive = true;
    Promise.all([listMyGroupBuys(), listMyUsedItems(), listMyFavorites(), listMyParticipations()])
      .then(([groupBuys, usedItems, favorites, participating]) => { if (alive) setData({ groupBuys, usedItems, favorites, participating }); })
      .catch((cause) => { if (alive) setError(cause.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [user]);

  if (authLoading) return <p>계정을 확인하고 있어요…</p>;
  if (!user) return <PageTitle><span className="eyebrow">MY INU</span><h1>내 활동</h1><p>참여한 공구와 찜한 상품을 확인하려면 로그인해 주세요.</p><Button $yellow as={Link} to="/login?next=%2Fme">인천대 이메일로 로그인</Button></PageTitle>;
  const listings = tab === 'participating' ? data.participating.map((item) => ({ item, kind: 'groupbuy' })) : tab === 'favorites' ? data.favorites.map((item) => ({ item, kind: 'used' })) : [...data.groupBuys.map((item) => ({ item, kind: 'groupbuy' })), ...data.usedItems.map((item) => ({ item, kind: 'used' }))];
  const removeFavorite = async (item) => {
    try { await toggleFavorite(item.id, true); setData((current) => ({ ...current, favorites: current.favorites.filter((entry) => entry.id !== item.id) })); }
    catch (cause) { window.alert(cause.message); }
  };
  return <><PageTitle><span className="eyebrow">MY INU</span><h1>내 활동</h1><p>{user.user_metadata?.nickname || user.email?.split('@')[0]}님, 함께 나눈 기록을 모아봤어요.</p></PageTitle>
    <Summary><div><span className="label">참여한 공구</span><strong>{data.participating.length}</strong></div><div className="yellow"><span className="label">찜한 중고</span><strong>{data.favorites.length}</strong></div><div><span className="label">내가 올린 공고</span><strong>{data.groupBuys.length + data.usedItems.length}</strong></div></Summary>
    <ActivityTabs>{[['participating', '참여한 공구'], ['favorites', '찜한 중고'], ['mine', '내 공고']].map(([key, label]) => <button type="button" key={key} aria-pressed={tab === key} onClick={() => setTab(key)}>{label}{key === 'participating' ? ` ${data.participating.length}` : key === 'favorites' ? ` ${data.favorites.length}` : ''}</button>)}</ActivityTabs>
    {error && <Empty>{error}</Empty>}{loading ? <Empty>활동을 불러오고 있어요…</Empty> : listings.length ? <Grid>{listings.map(({ item, kind }) => <PostCard key={`${kind}-${item.id}`} item={item} kind={kind} isFavorite={kind === 'used' && data.favorites.some((entry) => entry.id === item.id)} onFavorite={kind === 'used' ? removeFavorite : undefined} />)}</Grid> : <Empty><span className="emoji">{tab === 'favorites' ? '♡' : '▦'}</span><h3>아직 표시할 활동이 없어요</h3><p>공고에 참여하거나 관심 있는 상품을 찜해 보세요.</p><Button $yellow as={Link} to="/home">공고 둘러보기</Button></Empty>}
  </>;
}
