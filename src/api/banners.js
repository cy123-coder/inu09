import { requireSupabase } from '../lib/supabaseClient.js';

export async function listBanners() {
  const { data, error } = await requireSupabase().from('banners').select('*').eq('active', true).order('display_order');
  if (error) throw error;
  return data;
}
