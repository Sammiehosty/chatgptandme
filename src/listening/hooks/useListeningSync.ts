import { useEffect, useRef } from "react";
import ListeningApi from "../api/listeningApi";

interface SyncOptions {
  user: any;
  sermon: any;
  audio: HTMLAudioElement | null;
}

export default function useListeningSync({
  user,
  sermon,
  audio,
}: SyncOptions) {
  const timer = useRef<number>();

  // Save progress
  const saveProgress = async () => {
    if (!user || !sermon || !audio) return;

    if (audio.currentTime <= 0) return;

    try {
      await ListeningApi.saveProgress({
        user_id: user.id,
        sermon_id: sermon.id,
        current_time: Math.floor(audio.currentTime),
        duration: Math.floor(audio.duration || 0),
      });
    } catch (err) {
      console.error("Progress Sync Failed", err);
    }
  };

  // Save recently played
  const saveRecentlyPlayed = async () => {
    if (!user || !sermon) return;

    try {
      await ListeningApi.saveRecentlyPlayed(
        user.id,
        sermon.id
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!audio || !sermon) return;

    saveRecentlyPlayed();

    timer.current = window.setInterval(() => {
      saveProgress();
    }, 10000);

    const onPause = () => saveProgress();

    const onEnded = () => saveProgress();

    audio.addEventListener("pause", onPause);

    audio.addEventListener("ended", onEnded);

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }

      saveProgress();

      audio.removeEventListener(
        "pause",
        onPause
      );

      audio.removeEventListener(
        "ended",
        onEnded
      );
    };
  }, [user, sermon, audio]);

  // Browser close
  useEffect(() => {
    const unload = () => {
      saveProgress();
    };

    window.addEventListener(
      "beforeunload",
      unload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        unload
      );
    };
  }, [user, sermon, audio]);
}