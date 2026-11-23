import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Brand, Button, ConfigNotice, Footer, FormField, Header, HeaderActions, Links, Main, MobileNav, Search, Shell, TextButton } from './Layout.styles.js';
import Logo from '../Logo/Logo.jsx';
import { useAuth } from '../../hooks/AuthContext.jsx';
import { signOut } from '../../api/auth.js';
import { isSupabaseConfigured } from '../../lib/supabaseClient.js';

export default function Layout() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const activeKind = location.pathname === '/home' ? searchParams.get('kind') || 'all' : null;
  const goSearch = (event) => { event.preventDefault(); navigate(`/home?q=${encodeURIComponent(search.trim())}`); };
  const onSignOut = async () => { try { await signOut(); } finally { navigate('/home'); } };
  return <Shell>
    <Header>
      <Link to="/home"><Brand><Logo />09INU</Brand></Link>
      <Links><Link to="/home" aria-current={activeKind === 'all' ? 'page' : undefined}>홈</Link><Link to="/home?kind=groupbuy" aria-current={activeKind === 'groupbuy' ? 'page' : undefined}>공구</Link><Link to="/home?kind=used" aria-current={activeKind === 'used' ? 'page' : undefined}>중고거래</Link></Links>
      <Search onSubmit={goSearch}><span aria-hidden="true">⌕</span><input aria-label="공고 검색" placeholder="어떤 물건을 찾으세요?" value={search} onChange={(event) => setSearch(event.target.value)} /><button aria-label="검색" type="submit">↵</button></Search>
      <HeaderActions>{user?.isDemo ? <><TextButton as={Link} to="/me">체험 계정</TextButton><TextButton as={Link} to="/login">학교 계정 로그인</TextButton></> : user ? <><TextButton as={Link} to="/me">내 활동</TextButton><TextButton type="button" onClick={onSignOut}>로그아웃</TextButton></> : <TextButton as={Link} to="/login">로그인</TextButton>}<Button $yellow as={Link} to="/login">로그인</Button></HeaderActions>
    </Header>
    <Main>
      {user?.isDemo && <ConfigNotice>체험 계정입니다 · 공고와 활동은 이 기기에만 저장되며, 학교 계정 로그인 후에는 실제 계정에 저장됩니다.</ConfigNotice>}
      {!isSupabaseConfigured && !user?.isDemo && <ConfigNotice>미리보기 모드 · Supabase 키를 설정하면 공고 등록, 참여, 찜한 내용이 계정에 저장됩니다.</ConfigNotice>}
      <Outlet />
    </Main>
    <Footer><Brand><Logo />09INU</Brand><span>인천대학교 학생 전용 공구·중고 마켓</span><span>가까운 이웃과 함께 나눠요</span></Footer>
    <MobileNav aria-label="하단 메뉴">
      <Link to="/home" aria-current={activeKind === 'all' ? 'page' : undefined}><span>⌂</span>홈</Link><Link to="/home?kind=groupbuy" aria-current={activeKind === 'groupbuy' ? 'page' : undefined}><span>▦</span>공구</Link><Link to="/home?kind=used" aria-current={activeKind === 'used' ? 'page' : undefined}><span>♢</span>중고</Link><Link to={user ? '/me' : '/login'} aria-current={location.pathname === '/me' ? 'page' : undefined}><span>◉</span>내 활동</Link>
    </MobileNav>
  </Shell>;
}
