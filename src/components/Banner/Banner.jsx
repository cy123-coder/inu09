import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { demoBanners } from '../../lib/formatters.js';
import { BannerBox } from './Banner.styles.js';

export default function Banner({ banners = demoBanners }) {
  const available = banners.filter((banner) => banner.active !== false);
  const items = available.length ? available : demoBanners;
  const [index, setIndex] = useState(0);
  useEffect(() => { if (items.length < 2) return undefined; const timer = window.setInterval(() => setIndex((current) => (current + 1) % items.length), 6000); return () => window.clearInterval(timer); }, [items.length]);
  const item = items[index % items.length];
  return <BannerBox aria-roledescription="carousel" aria-label="서비스 안내 배너">
    {item.image_url && <img className="banner-image" src={item.image_url} alt="" />}
    <Link className="copy" to="/login"><span className="eyebrow">09INU · 인천대학교 공구·중고 마켓</span><h1 className="title">{item.title}</h1><p className="subtitle">{item.subtitle || '인천대 이웃과 함께 나누는 알뜰한 거래'}</p></Link>
    <Link className="banner-action" to="/login">로그인</Link>
    <div className="art" aria-hidden="true" /><span className="bag" aria-hidden="true">🛍️</span>
    {items.length > 1 && <div className="controls"><button type="button" aria-label="이전 배너" onClick={() => setIndex((index + items.length - 1) % items.length)}>‹</button><span className="dots">{items.map((entry, dot) => <i key={entry.id || dot} className={dot === index ? 'on' : ''} />)}</span><button type="button" aria-label="다음 배너" onClick={() => setIndex((index + 1) % items.length)}>›</button></div>}
  </BannerBox>;
}
