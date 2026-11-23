import { requireSupabase } from '../lib/supabaseClient.js';

export async function listUsedItems({ categoryId, search, limit = 30 } = {}) {
  let query = requireSupabase().from('used_items_with_counts').select('*').order('created_at', { ascending: false }).limit(limit);
  if (categoryId) query = query.eq('category_id', categoryId);
  if (search) query = query.ilike('title', `%${search}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getUsedItem(id) {
  const { data, error } = await requireSupabase().from('used_items_with_counts').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createUsedItem(input) {
  const db = requireSupabase();
  const { data: { user } } = await db.auth.getUser();
  if (!user) throw new Error('로그인이 필요해요.');
  const { data, error } = await db.from('used_items').insert({ ...input, author_id: user.id }).select().single();
  if (error) throw error;
  return data;
}

export async function toggleFavorite(usedItemId, isFavorite) {
  const db = requireSupabase();
  const { data: { user } } = await db.auth.getUser();
  if (!user) throw new Error('로그인이 필요해요.');
  const query = isFavorite
    ? db.from('favorites').delete().eq('used_item_id', usedItemId).eq('user_id', user.id)
    : db.from('favorites').insert({ used_item_id: usedItemId, user_id: user.id });
  const { error } = await query;
  if (error) throw error;
}

export async function setUsedItemStatus(id, status) {
  const { data, error } = await requireSupabase().from('used_items').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function updateUsedItem(id, changes) {
  const { data, error } = await requireSupabase().from('used_items').update(changes).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteUsedItem(id) {
  const { error } = await requireSupabase().from('used_items').delete().eq('id', id);
  if (error) throw error;
}

export async function getFavoriteState(id) {
  const db = requireSupabase();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return false;
  const { data, error } = await db.from('favorites').select('id').eq('used_item_id', id).eq('user_id', user.id).maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function listMyFavorites() {
  const db = requireSupabase();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return [];
  const { data: favoriteRows, error: favoriteError } = await db.from('favorites').select('used_item_id, created_at').eq('user_id', user.id).order('created_at', { ascending: false });
  if (favoriteError) throw favoriteError;
  const ids = favoriteRows.map((row) => row.used_item_id);
  if (!ids.length) return [];
  const { data, error } = await db.from('used_items_with_counts').select('*').in('id', ids);
  if (error) throw error;
  const order = new Map(ids.map((id, index) => [id, index]));
  return data.sort((a, b) => order.get(a.id) - order.get(b.id));
}

export async function listMyUsedItems() {
  const db = requireSupabase();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return [];
  const { data, error } = await db.from('used_items_with_counts').select('*').eq('author_id', user.id).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
