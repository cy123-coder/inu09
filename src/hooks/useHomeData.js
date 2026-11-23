import { useCallback, useEffect, useState } from 'react';
import { listBanners } from '../api/banners.js';
import { listGroupBuys, subscribeToGroupBuyChanges } from '../api/groupbuys.js';
import { listUsedItems } from '../api/usedItems.js';
import { demoBanners, getPreviewGroupBuys, getPreviewPosts, getPreviewUsedItems } from '../lib/formatters.js';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient.js';

export default function useHomeData() {
  const [data, setData] = useState({ groupBuys: [], usedItems: [], banners: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setData({ groupBuys: getPreviewGroupBuys(), usedItems: getPreviewUsedItems(), banners: demoBanners });
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const [groupBuys, usedItems, banners] = await Promise.all([listGroupBuys(), listUsedItems(), listBanners()]);
      const localPosts = getPreviewPosts();
      setData({
        groupBuys: [...localPosts.filter((item) => item.type === 'groupbuy'), ...groupBuys],
        usedItems: [...localPosts.filter((item) => item.type === 'used'), ...usedItems],
        banners: banners.length ? banners : demoBanners,
      });
    } catch (cause) {
      setError(cause.message || '공고를 불러오지 못했어요.');
      setData({ groupBuys: getPreviewGroupBuys(), usedItems: getPreviewUsedItems(), banners: demoBanners });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => {
    if (!supabase) return undefined;
    const channel = subscribeToGroupBuyChanges(refresh);
    return () => { supabase.removeChannel(channel); };
  }, [refresh]);

  return { ...data, loading, error, refresh };
}
