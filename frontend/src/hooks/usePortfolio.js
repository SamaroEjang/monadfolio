import { useState, useCallback } from 'react';

const API_BASE = '/api';

export function usePortfolio() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPortfolio = useCallback(async (wallet) => {
    if (!wallet?.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`${API_BASE}/portfolio/${wallet.trim()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch portfolio');
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchPortfolio };
}
