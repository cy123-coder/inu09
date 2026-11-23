import { requireSupabase } from '../lib/supabaseClient.js';

export async function uploadPostImages(files, userId) {
  const db = requireSupabase();
  const uploads = await Promise.all(files.map(async (file) => {
    const safeName = file.name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]/g, '-');
    const path = `${userId}/${crypto.randomUUID()}-${safeName}`;
    const { error } = await db.storage.from('post-images').upload(path, file, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    return db.storage.from('post-images').getPublicUrl(path).data.publicUrl;
  }));
  return uploads;
}
