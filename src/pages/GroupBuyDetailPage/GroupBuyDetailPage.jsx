import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteGroupBuy, getGroupBuy, getParticipationState, joinGroupBuy, leaveGroupBuy, updateGroupBuy } from '../../api/groupbuys.js';
import { Button } from '../../components/Layout/Layout.styles.js';
import Gauge from '../../components/Gauge/Gauge.jsx';
import { useAuth } from '../../hooks/AuthContext.jsx';
import { deletePreviewPost, formatDate, formatWon, getPreviewGroupBuys, getPreviewParticipation, setPreviewParticipation, timeAgo, updatePreviewPost } from '../../lib/formatters.js';
import { isSupabaseConfigured, supabase } from '../../lib/supabaseClient.js';
import { Back, Detail } from './GroupBuyDetailPage.styles.js';

export default function GroupBuyDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured || (user?.isDemo && (id.startsWith('demo-') || id.startsWith('preview-')))) { setItem(getPreviewGroupBuys().find((entry) => entry.id === id) ?? null); setJoined(getPreviewParticipation(id)); setLoading(false); return; }
    if (user?.isDemo) {
      try {
        const record = await getGroupBuy(id);
        const localJoined = getPreviewParticipation(id);
        setItem({ ...record, current_participants: (record.current_participants || 0) + (localJoined ? 1 : 0) });
        setJoined(localJoined);
        setError('');
      } catch (cause) { setError(cause.message); setItem(getPreviewGroupBuys().find((entry) => entry.id === id) ?? null); setJoined(getPreviewParticipation(id)); }
      finally { setLoading(false); }
      return;
    }
    try { const [record, participation] = await Promise.all([getGroupBuy(id), getParticipationState(id)]); setItem(record); setJoined(participation); setError(''); }
    catch (cause) { setError(cause.message); setItem(getPreviewGroupBuys().find((entry) => entry.id === id) ?? null); setJoined(getPreviewParticipation(id)); }
    finally { setLoading(false); }
  }, [id, user]);
  useEffect(() => { setLoading(true); refresh(); }, [refresh]);
  useEffect(() => {
    if (!supabase || !id) return undefined;
    const channel = supabase.channel(`group-buy-${id}`).on('broadcast', { event: 'group-buy-updated' }, refresh).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id, refresh]);

  const participate = async () => {
    const preview = id.startsWith('demo-') || id.startsWith('preview-');
    if ((!user || user.isDemo) && isSupabaseConfigured && !preview && !user?.isDemo) { navigate(`/login?next=${encodeURIComponent(`/groupbuys/${id}`)}`); return; }
    if (!isSupabaseConfigured || preview || user?.isDemo) {
      const current = item.current_participants ?? 0;
      if (!joined && current >= (item.max_participants ?? 1)) { window.alert('모집 정원이 가득 찼어요.'); return; }
      setPreviewParticipation(id, !joined);
      setJoined(!joined);
      if (user?.isDemo && !preview) setItem((currentItem) => ({ ...currentItem, current_participants: Math.max(0, (currentItem?.current_participants ?? 0) + (!joined ? 1 : -1)) }));
      else await refresh();
      return;
    }
    setBusy(true);
    try {
      if (joined) await leaveGroupBuy(id); else await joinGroupBuy(id);
      setJoined(!joined);
      await refresh();
    } catch (cause) { window.alert(cause.message || '참여 상태를 바꾸지 못했어요.'); }
    finally { setBusy(false); }
  };
  const editPost = () => navigate(`/new?edit=${encodeURIComponent(id)}&kind=groupbuy`);
  const removePost = async () => {
    if (!window.confirm('이 공구 공고를 삭제할까요? 참여자가 있는 공고는 삭제할 수 없어요.')) return;
    try { if (id.startsWith('preview-')) deletePreviewPost(id); else await deleteGroupBuy(id); navigate('/home?kind=groupbuy'); }
    catch (cause) { window.alert(cause.message); }
  };
  const closePost = async () => {
    if (!window.confirm('모집을 종료할까요? 종료 후에는 새로운 참여를 받을 수 없어요.')) return;
    try { if (id.startsWith('preview-')) updatePreviewPost(id, { status: 'closed' }); else await updateGroupBuy(id, { status: 'closed' }); await refresh(); }
    catch (cause) { window.alert(cause.message); }
  };

  if (loading) return <p>공구 정보를 불러오고 있어요…</p>;
  if (!item) return <><Back as={Link} to="/home">← 공고 목록으로</Back><p>{error || '공고를 찾을 수 없어요.'}</p></>;
  const current = item.current_participants ?? 0;
  const max = item.max_participants ?? 1;
  const own = Boolean(user?.id && item.author_id && item.author_id === user.id);
  const full = item.status === 'filled' || current >= max;
  const closed = item.status === 'closed' || (item.deadline && new Date(item.deadline) < new Date());
  const disabled = busy || closed || (full && !joined) || (!joined && own);
  return <>
    <Back as={Link} to="/home?kind=groupbuy">← 공구 목록으로</Back>
    <Detail>
      <div className="gallery"><div className="visual">{item.images?.[0] ? <img src={item.images[0]} alt={item.title} /> : <span className="emoji">{item.category_name === '전공책' ? '📚' : item.category_name === '생활' ? '🧻' : '📦'}</span>}</div>{item.images?.length > 1 && <div className="thumbs">{item.images.slice(1, 4).map((image) => <img key={image} src={image} alt="공구 상품" />)}</div>}</div>
      <div className="info"><div className="meta"><span>{item.category_name || item.category || '기타'}</span><span>·</span><span>{item.pickup_place}</span><span>·</span><span>{timeAgo(item.created_at)}</span></div><span className="tag">{full ? '모집 마감' : item.status === 'closed' ? '마감' : '공구 모집'}</span><h1>{item.title}</h1><div className="author">{item.nickname || item.profiles?.nickname || '09INU 이웃'} · 작성자</div>
        <div className="panel"><div className="panel-title">함께 모으고 있어요</div><Gauge current={current} total={max} /><div className="line"><span>참여 현황</span><strong>{current} / {max}명</strong></div><div className="line"><span>최소 모집 인원</span><strong>{item.min_participants}명</strong></div><div className="line"><span>모집 마감</span><strong>{formatDate(item.deadline)}</strong></div></div>
        <div className="panel"><div className="panel-title">한 사람당 부담 금액</div><div className="line"><span>예상 1인 금액</span><strong className="amount">{formatWon(item.price_per_person)}</strong></div><div className="line"><span>공동구매 총액</span><strong>{formatWon(item.total_price)}</strong></div></div>
        <p className="description">{item.description}</p><div className="line"><span>수령 장소</span><strong>{item.pickup_place}</strong></div>
        {own && <><div className="cta owner-actions"><Button $outline type="button" onClick={editPost}>공고 수정</Button><Button $outline type="button" onClick={removePost}>공고 삭제</Button></div><Button $outline type="button" onClick={closePost} disabled={closed}>모집 종료</Button></>}
        <div className="cta primary-actions"><button className={joined ? 'cancel' : 'secondary'} type="button" disabled={disabled} onClick={participate}>{busy ? '처리 중…' : joined ? '참여 취소' : closed ? '모집 마감' : full ? '정원 마감' : '참여하기'}</button><Button $outline as={Link} to="/home?kind=groupbuy">목록으로</Button></div><p className="fine">결제는 포함되지 않아요. 참여 후 이웃과 수령 방법을 정해 주세요.</p>
      </div>
    </Detail>
  </>;
}
