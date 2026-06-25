import { useEffect, useState } from "react";
import ListeningApi from "../api/listeningApi";

export interface ContinueListeningData {
  sermon_id: number;
  title: string;
  current_time: number;
  duration: number;
  progress_percent: number;
}

export default function useContinueListening(user: any) {
  const [loading, setLoading] = useState(true);

  const [continueListening, setContinueListening] =
    useState<ContinueListeningData | null>(null);

  const loadProgress = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const result = await ListeningApi.loadProgress(user.id);

      if (result.success && result.progress) {
        setContinueListening(result.progress);
      } else {
        setContinueListening(null);
      }
    } catch (err) {
      console.error(err);
      setContinueListening(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadProgress();
  }, [user]);

  const refresh = () => {
    loadProgress();
  };

  return {
    loading,
    continueListening,
    refresh,
  };
}