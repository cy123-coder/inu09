import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient.js';

const AuthContext = createContext(null);

function getDeviceDemoUser() {
  let id = 'device-demo-user';
  try {
    id = window.localStorage.getItem('09inu-demo-user-id') || `demo-user-${window.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem('09inu-demo-user-id', id);
  } catch { /* The session still works when browser storage is unavailable. */ }
  return { id, isDemo: true, user_metadata: { nickname: '체험 사용자' } };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) { setUser(getDeviceDemoUser()); return undefined; }
    let alive = true;
    supabase.auth.getSession().then(({ data }) => { if (alive) { setUser(data.session?.user ?? getDeviceDemoUser()); setLoading(false); } });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? getDeviceDemoUser());
      setLoading(false);
    });
    return () => { alive = false; subscription.unsubscribe(); };
  }, []);

  const value = useMemo(() => ({ user, loading, configured: isSupabaseConfigured }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth는 AuthProvider 안에서 사용해야 합니다.');
  return context;
}
