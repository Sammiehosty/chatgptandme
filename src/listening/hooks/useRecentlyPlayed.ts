import { useEffect, useState } from "react";
import ListeningApi from "../api/listeningApi";

export interface RecentlyPlayedItem {
  id: number;
  title: string;
  description?: string;
  speaker?: string;
  date?: string;
  duration?: string;
  duration_formatted?: string;
  date_formatted?: string;
  thumbnail?: string;
  cover_image?: string;
  play_count?: number;
}

export default function useRecentlyPlayed(user: any) {
  const [loading, setLoading] = useState(true);

  const [recentlyPlayed, setRecentlyPlayed] = useState<
    RecentlyPlayedItem[]
  >([]);

  const loadRecentlyPlayed = async () => {
    if (!user) {
      setRecentlyPlayed([]);
      setLoading(false);
      return;
    }

    try {
      const result = await ListeningApi.getRecentlyPlayed(
        user.id
      );

      if (result.success) {
        setRecentlyPlayed(result.sermons || []);
      } else {
        setRecentlyPlayed([]);
      }
    } catch (err) {
      console.error(err);
      setRecentlyPlayed([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadRecentlyPlayed();
  }, [user]);

  return {
    loading,
    recentlyPlayed,
    refresh: loadRecentlyPlayed,
  };
}