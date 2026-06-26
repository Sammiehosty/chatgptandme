import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from 'react';
import type { Sermon } from './types';
import {
    recordPlay,
    saveProgress,
    getStreamUrl,
    isUsingDemo
} from './api';

type RepeatMode = 'none' | 'all' | 'one';

interface PlayerContextType {
  currentSermon: Sermon | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  queue: Sermon[];
  playbackRate: number;
  repeatMode: RepeatMode;
  play: (sermon: Sermon, sermonList?: Sermon[]) => void;
  togglePlay: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  setPlaybackRate: (rate: number) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  playNext: () => void;
  playPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playRecordedRef = useRef(false);
  const lastProgressSaveRef = useRef(0);
  const currentSermonRef = useRef<Sermon | null>(null);
  const [currentSermon, setCurrentSermon] = useState<Sermon | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isLoading, setIsLoading] = useState(false);
  const [queue, setQueue] = useState<Sermon[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [repeatMode, setRepeatModeState] = useState<RepeatMode>('none');

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = volume;
    audio.playbackRate = playbackRate;
    audioRef.current = audio;

   

 audio.addEventListener("timeupdate", () => {

    setCurrentTime(audio.currentTime);

    // Count play after 30 seconds
    if (
        currentSermonRef.current &&
        !playRecordedRef.current &&
        audio.currentTime >= 30
    ) {

        playRecordedRef.current = true;

        recordPlay(currentSermonRef.current.id);

    }

   if (

    currentSermonRef.current &&

    audio.currentTime - lastProgressSaveRef.current >= 30

) {

    lastProgressSaveRef.current = audio.currentTime;

    saveProgress(

        currentSermonRef.current.id,

        audio.currentTime,

        audio.duration

    );

}

});



    audio.addEventListener('durationchange', () => setDuration(audio.duration));
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
      setIsLoading(false);
    });
    audio.addEventListener('playing', () => {
      setIsPlaying(true);
      setIsLoading(false);
    });
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('waiting', () => setIsLoading(true));
    audio.addEventListener('canplay', () => setIsLoading(false));
    audio.addEventListener('ended', handleTrackEnd);
    audio.addEventListener('error', () => {
      setIsLoading(false);
      setIsPlaying(false);
    });

    // Media session API for lock screen controls
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => audio.play());
      navigator.mediaSession.setActionHandler('pause', () => audio.pause());
      navigator.mediaSession.setActionHandler('previoustrack', () => {});
      navigator.mediaSession.setActionHandler('nexttrack', () => {});
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const handleTrackEnd = useCallback(() => {
    setIsPlaying(false);
    
    if (repeatMode === 'one') {
      // Repeat current track
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else if (currentIndex < queue.length - 1) {
      // Play next track
      playAtIndex(currentIndex + 1);
    } else if (repeatMode === 'all' && queue.length > 0) {
      // Loop back to first track
      playAtIndex(0);
    }
  }, [repeatMode, currentIndex, queue.length]);

  // Update ended event listener when repeat mode changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.removeEventListener('ended', handleTrackEnd);
    audio.addEventListener('ended', handleTrackEnd);
    
    return () => audio.removeEventListener('ended', handleTrackEnd);
  }, [handleTrackEnd]);

  const playAtIndex = useCallback((index: number) => {
    if (index < 0 || index >= queue.length) return;
    const sermon = queue[index];
    setCurrentIndex(index);
    setCurrentSermon(sermon);
    currentSermonRef.current = sermon;
    setIsLoading(true);
    setCurrentTime(0);
    playRecordedRef.current = false;
    lastProgressSaveRef.current = 0;

    const audio = audioRef.current;
    if (!audio) return;

    if (isUsingDemo()) {
      audio.src = '';
      setDuration(sermon.duration);
      setIsLoading(false);
      setIsPlaying(true);
      return;
    }

    audio.src = getStreamUrl(sermon);
    audio.playbackRate = playbackRate;
    audio.play().catch(() => setIsLoading(false));

    // Update media session metadata
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: sermon.title,
        artist: 'Sermon',
        album: 'Sermons',
      });
    }
  }, [queue, playbackRate]);

  const play = useCallback((sermon: Sermon, sermonList?: Sermon[]) => {
    const newQueue = sermonList || [sermon];
    const index = newQueue.findIndex(s => s.id === sermon.id);
    setQueue(newQueue);
    
    setCurrentSermon(sermon);
    currentSermonRef.current = sermon;
    setIsLoading(true);
    setCurrentTime(0);
    playRecordedRef.current = false;
    lastProgressSaveRef.current = 0;
    setCurrentIndex(index >= 0 ? index : 0);

    const audio = audioRef.current;
    if (!audio) return;

    if (isUsingDemo()) {
      audio.src = '';
      setDuration(sermon.duration);
      setIsLoading(false);
      setIsPlaying(true);
      return;
    }

    audio.src = getStreamUrl(sermon);
    audio.playbackRate = playbackRate;
    audio.play().catch(() => setIsLoading(false));

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: sermon.title,
        artist: 'Sermon',
        album: 'Sermons',
      });
    }
  }, [playbackRate]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentSermon) return;

    if (isUsingDemo()) {
      setIsPlaying(p => !p);
      return;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  }, [isPlaying, currentSermon]);

  const pauseFn = useCallback(() => {
    if (isUsingDemo()) {
      setIsPlaying(false);
      return;
    }
    audioRef.current?.pause();
  }, []);

  const seek = useCallback((time: number) => {
    if (isUsingDemo()) {
      setCurrentTime(time);
      return;
    }
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    setPlaybackRateState(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, []);

  const setRepeatMode = useCallback((mode: RepeatMode) => {
    setRepeatModeState(mode);
  }, []);

  const playNext = useCallback(() => {
    if (currentIndex < queue.length - 1) {
      playAtIndex(currentIndex + 1);
    } else if (repeatMode === 'all' && queue.length > 0) {
      playAtIndex(0);
    }
  }, [currentIndex, queue.length, repeatMode, playAtIndex]);

  const playPrev = useCallback(() => {
    // If more than 3 seconds into track, restart it
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      return;
    }
    
    if (currentIndex > 0) {
      playAtIndex(currentIndex - 1);
    } else if (repeatMode === 'all' && queue.length > 0) {
      playAtIndex(queue.length - 1);
    }
  }, [currentIndex, currentTime, queue.length, repeatMode, playAtIndex]);

  // Demo mode timer for simulated playback
  useEffect(() => {
    if (!isUsingDemo() || !isPlaying || !currentSermon) return;
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const increment = playbackRate; // Speed affects progress
        if (prev + increment >= currentSermon.duration) {
          handleTrackEnd();
          return 0;
        }
        return prev + increment;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, currentSermon, playbackRate, handleTrackEnd]);

  return (
    <PlayerContext.Provider
      value={{
        currentSermon,
        isPlaying,
        currentTime,
        duration: isUsingDemo() && currentSermon ? currentSermon.duration : duration,
        volume,
        isLoading,
        queue,
        playbackRate,
        repeatMode,
        play,
        togglePlay,
        pause: pauseFn,
        seek,
        setVolume,
        setPlaybackRate,
        setRepeatMode,
        playNext,
        playPrev,
        hasNext: currentIndex < queue.length - 1 || repeatMode === 'all',
        hasPrev: currentIndex > 0 || repeatMode === 'all',
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
