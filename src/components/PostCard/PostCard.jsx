import React from 'react';
import { Link } from 'react-router-dom';
import { formatWon, timeAgo } from '../../lib/formatters.js';
import Gauge from '../Gauge/Gauge.jsx';
import { Badge, Body, Card, Favorite, Visual } from './PostCard.styles.js';

const iconByCategory = { 식품: '🍜', 생활: '🧻', 전공책: '📚', 전자기기: '⌨️', 의류: '🧥', 기타: '🛍️' };

export default function PostCard({ item, kind, isFavorite = false, onFavorite }) {
  const isGroup = kind === 'groupbuy';
  const max = item.max_participants ?? 1;
  const current = item.current_participants ?? 0;
  const full = isGroup && (item.status === 'filled' || current >= max);
  const sold = !isGroup && item.status === 'sold';
  const category = item.category_name ?? item.category ?? '기타';
  const destination = isGroup ? `/groupbuys/${item.id}` : `/used/${item.id}`;
  return <Card className={sold ? 'sold' : ''}>
    <Link to={destination} aria-label={`${item.title} 상세 보기`}>
      <Visual $kind={kind}><Badge $kind={kind}>{isGroup ? '공구' : '중고'}</Badge><span className="item-emoji" aria-hidden="true">{iconByCategory[category] ?? (isGroup ? '📦' : '🛍️')}</span></Visual>
    </Link>
    {!isGroup && <Favorite type="button" aria-label={isFavorite ? '찜 해제' : '찜하기'} aria-pressed={isFavorite} $active={isFavorite} onClick={() => onFavorite?.(item)}>{isFavorite ? '♥' : '♡'}</Favorite>}
    <Body>
      <div className="meta"><span>{category}</span><span>{isGroup ? item.pickup_place : item.place}</span><span>{timeAgo(item.created_at)}</span></div>
      <Link to={destination}><h3>{item.title}</h3><p className="description">{item.description || '상세 설명을 확인해 주세요.'}</p></Link>
      {isGroup ? <><div className="price">{formatWon(item.price_per_person)} <small>/ 1인</small></div><Gauge current={current} total={max} /><div className="counts"><span><b>{current}</b> / {max}명 참여</span><span>{full ? '모집 마감' : `최소 ${item.min_participants ?? 1}명`}</span></div></> : <><div className="price">{formatWon(item.price)}</div><div className="counts"><span>상태 · {sold ? '거래 완료' : item.status === 'reserved' ? '예약 중' : item.condition || '판매 중'}</span><span>찜 {item.favorite_count ?? 0}</span></div></>}
      <div className="details"><span>{item.nickname || item.profiles?.nickname || '09INU 이웃'}</span><Link to={destination}>자세히 보기 <b>→</b></Link></div>
    </Body>
  </Card>;
}
