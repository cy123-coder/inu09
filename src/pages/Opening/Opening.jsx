import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo/Logo.jsx';
import { Screen } from './Opening.styles.js';

export default function Opening() {
  const navigate = useNavigate();
  useEffect(() => { const timer = window.setTimeout(() => navigate('/home', { replace: true }), 1900); return () => window.clearTimeout(timer); }, [navigate]);
  return <Screen onClick={() => navigate('/home', { replace: true })} aria-label="09INU 시작하기"><Logo large /><p>인천대학교 공구·중고 마켓</p></Screen>;
}
