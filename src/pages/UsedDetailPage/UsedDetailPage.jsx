import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteUsedItem, getFavoriteState, getUsedItem, setUsedItemStatus, toggleFavorite, updateUsedItem } from '../../api/usedItems.js';
import { Button } from '../../components/Layout/Layout.styles.js';
import { useAuth } from '../../hooks/AuthContext.jsx';
import { formatWon, getPreviewFavoriteIds, getPreviewUsedItems, setPreviewFavorite, timeAgo } from '../../lib/formatters.js';
import { isSupabaseConfigured } from '../../lib/supabaseClient.js';
import { Back } from '../GroupBuyDetailPage/GroupBuyDetailPage.styles.js';
import { Detail } from './UsedDetailPage.styles.js';

export default function UsedDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [favorite, setFavorite] = useState(() => getPreviewFavoriteIds().includes(id));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) { setItem(getPreviewUsedItems().find((entry) => entry.id === id) ?? null); setFavorite(getPreviewFavoriteIds().includes(id)); return; }
    try { const record = await getUsedItem(id); setItem(record); if (user) setFavorite(await getFavoriteState(id)); setError(''); }
    catch (cause) { setError(cause.message); setItem(getPreviewUsedItems().find((entry) => entry.id === id) ?? null); setFavorite(getPreviewFavoriteIds().includes(id)); }
  }, [id, user]);
  useEffect(() => { refresh(); }, [refresh]);

  const onFavorite = async () => {
    const preview = id.startsWith('demo-') || id.startsWith('preview-');
    if (!user && isSupabaseConfigured && !preview) { navigate(`/login?next=${encodeURIComponent(`/used/${id}`)}`); return; }
    if (isSupabaseConfigured && !preview) {
      setBusy(true);
      try { await toggleFavorite(id, favorite); setFavorite(!favorite); await refresh(); }
      catch (cause) { window.alert(cause.message); }
      finally { setBusy(false); }
    } else { const next = !favorite; setFavorite(next); setPreviewFavorite(id, next); }
  };
  const updateStatus = async (status) => {
    try { await setUsedItemStatus(id, status); await refresh(); } catch (cause) { window.alert(cause.message); }
  };
  const editPost = async () => {
    const nextTitle = window.prompt('상품명을 수정해 주세요.', item.title);
    if (nextTitle === null || !nextTitle.trim()) return;
    const nextDescription = window.prompt('설명을 수정해 주세요.', item.description || '');
    if (nextDescription === null) return;
    try { await updateUsedItem(id, { title: nextTitle.trim(), description: nextDescription.trim() }); await refresh(); }
    catch (cause) { window.alert(cause.message); }
  };
  const removePost = async () => {
    if (!window.confirm('이 중고 공고를 삭제할까요?')) return;
    try { await deleteUsedItem(id); navigate('/home?kind=used'); }
    catch (cause) { window.alert(cause.message); }
  };

  if (!item && !error) return <p>상품 정보를 불러오고 있어요…</p>;
  if (!item) return <><Back as={Link} to="/home?kind=used">← 중고거래 목록으로</Back><p>{error || '상품을 찾을 수 없어요.'}</p></>;
  const own = Boolean(user?.id && item.author_id && item.author_id === user.id);
  const statusText = item.status === 'sold' ? '거래 완료' : item.status === 'reserved' ? '예약 중' : '판매 중';
  return <>
    <Back as={Link} to="/home?kind=used">← 중고거래 목록으로</Back>
    <Detail><div className="gallery"><div className="visual">{item.images?.[0] ? <img src={item.images[0]} alt={item.title} /> : <span className="emoji">{item.category_name === '전공책' ? '📚' : item.category_name === '의류' ? '🧥' : '🛍️'}</span>}</div></div>
      <div className="info"><div className="meta"><span>{item.category_name || item.category || '기타'}</span><span>·</span><span>{item.place}</span><span>·</span><span>{timeAgo(item.created_at)}</span></div><span className="tag">{statusText}</span><h1>{item.title}</h1><div className="price">{formatWon(item.price)}</div><div className="author">{item.nickname || item.profiles?.nickname || '09INU 이웃'} · 인천대 학생</div>
        <p className="description">{item.description}</p><div className="line"><span>상품 상태</span><strong>{item.condition || '좋음'}</strong></div><div className="line"><span>거래 장소</span><strong>{item.place}</strong></div><div className="line"><span>찜</span><strong>{(item.favorite_count ?? 0) + ((!isSupabaseConfigured || id.startsWith('demo-') || id.startsWith('preview-')) && favorite ? 1 : 0)}명</strong></div>
        {own ? <><div className="status-controls"><button type="button" onClick={() => updateStatus('selling')}>판매 중</button><button type="button" onClick={() => updateStatus('reserved')}>예약 중</button><button type="button" onClick={() => updateStatus('sold')}>거래 완료</button></div><div className="status-controls"><button type="button" onClick={editPost}>상품 수정</button><button type="button" onClick={removePost}>상품 삭제</button></div></> : <div className="actions"><button type="button" aria-label={favorite ? '찜 해제' : '찜하기'} aria-pressed={favorite} onClick={onFavorite} disabled={busy}>{favorite ? '♥' : '♡'}</button><Button type="button" disabled={item.status === 'sold'} onClick={onFavorite}>{favorite ? '찜 해제하기' : '관심 상품으로 저장'}</Button></div>}
        <p className="description">안전한 거래를 위해 교내 공공장소에서 만나 거래해 주세요.</p><Button $outline as={Link} to="/home?kind=used">중고 상품 더 보기</Button>
      </div>
    </Detail>
  </>;
}
