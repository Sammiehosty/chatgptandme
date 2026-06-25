import { useEffect, useState } from "react";
import ListeningApi from "../api/listeningApi";

export interface ListeningStats {
  total_sermons: number;
  completed_sermons: number;
  total_listening_seconds: number;
  longest_session: number;
  current_streak: number;
  longest_streak: number;
  favorite_sermon: number | null;
  favorite_month: string | null;
  last_listened: string | null;
}

const defaultStats: ListeningStats = {
  total_sermons: 0,
  completed_sermons: 0,
  total_listening_seconds: 0,
  longest_session: 0,
  current_streak: 0,
  longest_streak: 0,
  favorite_sermon: null,
  favorite_month: null,
  last_listened: null,
};

export default function useListeningStats(user: any) {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] =
    useState<ListeningStats>(defaultStats);

  const loadStats = async () => {
    if (!user) {
      setStats(defaultStats);
      setLoading(false);
      return;
    }

    try {
      const result = await ListeningApi.getStats(user.id);

      if (result.success && result.stats) {
        setStats({
          ...defaultStats,
          ...result.stats,
        });
      } else {
        setStats(defaultStats);
      }
    } catch (err) {
      console.error(err);
      setStats(defaultStats);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, [user]);

  return {
    loading,
    stats,
    refresh: loadStats,
  };
}