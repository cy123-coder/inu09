import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { sendUniversityMagicLink } from '../../api/auth.js';
import Logo from '../../components/Logo/Logo.jsx';
import { useAuth } from '../../hooks/AuthContext.jsx';
import { isSupabaseConfigured } from '../../lib/supabaseClient.js';
import { LoginCard } from './LoginPage.styles.js';

function safeNext(value) { return value?.startsWith('/') && !value.startsWith('//') ? value : '/home'; }

export default function LoginPage() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const next = safeNext(params.get('next'));
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (user && !user.isDemo) navigate(next, { replace: true }); }, [user, next, navigate]);

  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try { await sendUniversityMagicLink(email, nickname, next); setMessage('인천대학교 이메일로 로그인 링크를 보냈어요. 메일함을 확인해 주세요.'); }
    catch (cause) { setError(cause.message || '로그인 링크를 보내지 못했어요.'); }
    finally { setBusy(false); }
  };

  return <LoginCard><div className="logo"><Logo large /></div><span className="eyebrow">INU STUDENT MARKET</span><h1>인천대 계정으로 시작해요</h1><p className="lead">학교 이메일로 안전하게 로그인하고<br />공구와 중고거래를 이용해 보세요.</p>
    {isSupabaseConfigured ? <form className="form" onSubmit={submit}><label>닉네임<input required minLength={2} maxLength={24} value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder="이웃에게 보여질 이름" /></label><label>학교 이메일<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@inu.ac.kr" /></label><button className="submit" type="submit" disabled={busy}>{busy ? '보내는 중…' : '로그인 링크 받기'}</button><span className="hint">@inu.ac.kr 이메일만 사용할 수 있어요. 비밀번호 대신 일회용 링크를 보내드려요.</span></form> : <div className="warning">현재는 미리보기 모드예요. Supabase 프로젝트 URL과 anon key를 환경변수에 설정하고, migration을 적용하면 학교 이메일 로그인과 계정별 활동이 활성화돼요.</div>}
    {error && <p className="warning" role="alert">{error}</p>}{message && <p className="status" role="status">{message}</p>}<Link className="back" to="/home">공고 둘러보기 →</Link>
  </LoginCard>;
}
