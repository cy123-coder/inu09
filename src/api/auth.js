import { requireSupabase } from '../lib/supabaseClient.js';

export async function sendUniversityMagicLink(email, nickname = '', next = '/home') {
  const normalized = email.trim().toLowerCase();
  if (!normalized.endsWith('@inu.ac.kr')) throw new Error('인천대학교 이메일(@inu.ac.kr)만 사용할 수 있어요.');
  const { error } = await requireSupabase().auth.signInWithOtp({
    email: normalized,
    options: { emailRedirectTo: `${window.location.origin}${next}`, data: { nickname: nickname.trim() } },
  });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await requireSupabase().auth.signOut();
  if (error) throw error;
}
