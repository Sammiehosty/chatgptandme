import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  ChevronUp, ChevronDown, Loader2, Repeat, Repeat1, 
  ListMusic, X, Gauge
} from 'lucide-react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { usePlayer } from '../PlayerContext';
import { getSettings, type AppSettings } from '../api';

export default function AudioPlayer() {
  const {
    currentSermon,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoading,
    queue,
    togglePlay,
    seek,
    setVolume,
    playNext,
    playPrev,
    hasNext,
    hasPrev,
    playbackRate,
    setPlaybackRate,
    repeatMode,
    setRepeatMode,
    play,
  } = usePlayer();

  const [expanded, setExpanded] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({});
  const progressRef = useRef<HTMLDivElement>(null);
  const expandedProgressRef = useRef<HTMLDivElement>(null);

  useEffect(() => { getSettings().then(setSettings); }, []);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current || !duration) return;
    const rect = ref.current.getBoundingClientRect();
    seek((e.clientX - rect.left) / rect.width * duration);
  }, [duration, seek]);

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  useEffect(() => {
    const close = () => { setShowVolume(false); setShowSpeed(false); };
    if (showVolume || showSpeed) {
      document.addEventListener('click', close);
      return () => document.removeEventListener('click', close);
    }
  }, [showVolume, showSpeed]);

  if (!currentSermon) return null;

  const iconColors = [
    'from-amber-400 to-orange-500', 'from-indigo-400 to-purple-500',
    'from-emerald-400 to-teal-500', 'from-rose-400 to-pink-500',
    'from-sky-400 to-cyan-500', 'from-violet-400 to-fuchsia-500',
  ];
  const iconColor = iconColors[currentSermon.id % iconColors.length];
  const currentIndex = queue.findIndex(s => s.id === currentSermon.id);
  const queueItems = queue.slice(0, 10);
  const albumArt = settings.album_art_url || 'https://pst.sammiehosty.com/logo.jpg';

  return (
    <>
      {/* ── Queue Sidebar ── */}
      {showQueue && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowQueue(false)} />
          <div className="relative ml-auto w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border-l border-white/10 h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Up Next</h3>
                <p className="text-xs text-slate-500 tracking-wide">{queue.length} sermons in queue</p>
              </div>
              <button onClick={() => setShowQueue(false)} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {queueItems.map((sermon, idx) => (
                <button
                  key={sermon.id}
                  onClick={() => { play(sermon, queue); setShowQueue(false); }}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-all border-b border-white/5 ${
                    sermon.id === currentSermon.id ? 'bg-gradient-to-r from-amber-500/10 to-transparent' : 'hover:bg-white/5'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                    sermon.id === currentSermon.id
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                      : 'bg-white/5 text-slate-400'
                  }`}>
                    {sermon.id === currentSermon.id && isPlaying ? (
                      <div className="flex items-center gap-0.5">
                        <span className="w-0.5 h-3 bg-white rounded-full animate-pulse" />
                        <span className="w-0.5 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
                        <span className="w-0.5 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                      </div>
                    ) : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate tracking-tight ${sermon.id === currentSermon.id ? 'text-amber-400' : 'text-white'}`}>{sermon.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 tracking-wide">{sermon.duration_formatted} • {sermon.date_formatted}</p>
                  </div>
                </button>
              ))}
              {queue.length > 10 && (
                <div className="p-4 text-center text-sm text-slate-500 tracking-wide">+{queue.length - 10} more sermons</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Expanded Now Playing ── */}
      {expanded && (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-slate-900 via-slate-950 to-black overflow-hidden" style={{ height: '100dvh' }}>
          <div className="h-full flex flex-col">
            {/* Top bar - fixed */}
            <div className="flex items-center justify-between px-4 py-2 shrink-0">
              <button onClick={() => setExpanded(false)} className="p-2 -ml-2 text-slate-400 hover:text-white rounded-lg">
                <ChevronDown className="w-6 h-6" />
              </button>
              <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-[0.15em]">Now Playing</p>
              <button onClick={() => setShowQueue(true)} className="p-2 -mr-2 text-slate-400 hover:text-white rounded-lg">
                <ListMusic className="w-5 h-5" />
              </button>
            </div>

            {/* Center content - fills remaining space */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 min-h-0">
              {/* Album art */}
              <div className={`w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-3xl bg-gradient-to-br ${iconColor} shadow-2xl shadow-black/50 shrink-0 relative overflow-hidden`}>
                <img
                  src={albumArt}
                  alt="Album Art"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-3xl z-10">
                    <Loader2 className="w-10 h-10 text-white animate-spin mb-2" />
                    <p className="text-white text-xs font-medium tracking-wide">Getting audio...</p>
                    <p className="text-white/60 text-[10px] tracking-wide">from Telegram channel</p>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="text-center max-w-sm w-full mt-5 mb-3 shrink-0">
                <h2 className="text-lg sm:text-xl font-bold text-white line-clamp-2 font-serif-display leading-snug tracking-tight">{currentSermon.title}</h2>
                <p className="text-[11px] text-slate-500 mt-1 font-medium tracking-wide">{currentSermon.date_formatted}</p>
              </div>

              {/* Progress */}
              <div className="w-full max-w-sm mb-4 shrink-0">
                <div ref={expandedProgressRef} onClick={(e) => handleProgressClick(e, expandedProgressRef)} className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer group">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full relative" style={{ width: `${progress}%` }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
                  </div>
                </div>
                <div className="flex justify-between mt-1.5 text-[10px] text-slate-500 font-semibold tracking-widest tabular-nums">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Main Controls */}
              <div className="flex items-center justify-center gap-5 mb-3 shrink-0">
                <button
                  onClick={() => setRepeatMode(repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none')}
                  className={`p-2.5 rounded-full transition-all ${repeatMode !== 'none' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-white'}`}
                >
                  {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
                </button>

                <button onClick={playPrev} disabled={!hasPrev} className="p-2 text-white disabled:text-slate-600 hover:scale-110 active:scale-95 transition-transform">
                  <SkipBack className="w-7 h-7" fill="currentColor" />
                </button>

                <button onClick={togglePlay} className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all">
                  {isLoading ? (
                    <Loader2 className="w-7 h-7 text-white animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-7 h-7 text-white" fill="white" />
                  ) : (
                    <Play className="w-7 h-7 text-white ml-1" fill="white" />
                  )}
                </button>

                <button onClick={playNext} disabled={!hasNext} className="p-2 text-white disabled:text-slate-600 hover:scale-110 active:scale-95 transition-transform">
                  <SkipForward className="w-7 h-7" fill="currentColor" />
                </button>

                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowSpeed(!showSpeed); }}
                    className={`p-2.5 rounded-full transition-all ${playbackRate !== 1 ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Gauge className="w-5 h-5" />
                  </button>
                  {showSpeed && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 rounded-2xl p-2 shadow-xl border border-white/10 min-w-[140px]" onClick={e => e.stopPropagation()}>
                      <p className="text-[10px] text-slate-500 font-semibold px-3 py-1 tracking-wider uppercase">Speed</p>
                      {speedOptions.map(speed => (
                        <button key={speed} onClick={() => { setPlaybackRate(speed); setShowSpeed(false); }}
                          className={`block w-full px-3 py-2 text-sm text-left rounded-xl tracking-tight ${playbackRate === speed ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-300 hover:bg-white/5 font-medium'}`}>
                          {speed}x {speed === 1 && <span className="text-slate-500 font-normal">(Normal)</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Secondary Controls */}
              <div className="flex items-center justify-between w-full max-w-sm shrink-0">
                <div className="relative">
                  <button onClick={(e) => { e.stopPropagation(); setShowVolume(!showVolume); }} className="p-2 text-slate-400 hover:text-white">
                    {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  {showVolume && (
                    <div className="absolute bottom-full left-0 mb-2 bg-slate-800 rounded-xl p-4 shadow-xl border border-white/10" onClick={e => e.stopPropagation()}>
                      <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-28 accent-amber-500" />
                    </div>
                  )}
                </div>
                {queue.length > 1 && <p className="text-[10px] text-slate-500 font-semibold tracking-wider tabular-nums">{currentIndex + 1} of {queue.length}</p>}
                <button onClick={() => setShowQueue(true)} className="p-2 text-slate-400 hover:text-white flex items-center gap-1">
                  <ListMusic className="w-5 h-5" />
                  <span className="text-[10px] font-semibold tracking-wide">{queue.length}</span>
                </button>
              </div>
            </div>

            {/* Worship text - pinned to bottom */}
            {settings.worship_text && (
              <div className="shrink-0 px-6 pb-4 pt-2">
                <p className="text-[14px] text-center text-amber-400/50 tracking-wide leading-relaxed italic">
                  {settings.worship_text}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Mini Player Bar ── */}
      {!expanded && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-white/10 shadow-2xl shadow-black/50">
          <div ref={progressRef} onClick={(e) => handleProgressClick(e, progressRef)} className="absolute top-0 left-0 right-0 h-1 bg-white/5 cursor-pointer -translate-y-full">
            <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: `${progress}%` }} />
          </div>

          <div className="max-w-7xl mx-auto px-3 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-4 h-[76px]">
              {/* Info */}
              <button onClick={() => setExpanded(true)} className="flex items-center gap-3 flex-1 min-w-0 text-left group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconColor} shrink-0 shadow-lg group-hover:scale-105 transition-transform relative overflow-hidden`}>
                  <img src={albumArt} alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  {isLoading && <div className="absolute inset-0 flex items-center justify-center bg-black/40"><Loader2 className="w-5 h-5 text-white animate-spin" /></div>}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-amber-400 transition-colors tracking-tight">{currentSermon.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 tracking-wide">
                    {isLoading ? (
                      <span className="text-amber-400 font-medium">Getting audio from Telegram...</span>
                    ) : (
                      <>
                        <span className="tabular-nums font-medium">{formatTime(currentTime)} / {formatTime(duration)}</span>
                        {playbackRate !== 1 && <span className="px-1.5 py-0.5 bg-amber-500/20 rounded text-amber-400 font-bold text-[10px]">{playbackRate}x</span>}
                        {repeatMode !== 'none' && <span className="text-amber-400">{repeatMode === 'one' ? <Repeat1 className="w-3 h-3" /> : <Repeat className="w-3 h-3" />}</span>}
                      </>
                    )}
                  </div>
                </div>
                <ChevronUp className="w-5 h-5 text-slate-500 shrink-0 group-hover:text-white transition-colors" />
              </button>

              {/* Controls */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button onClick={playPrev} disabled={!hasPrev} className="hidden sm:block p-2 text-slate-400 disabled:text-slate-700 hover:text-white">
                  <SkipBack className="w-5 h-5" fill="currentColor" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform">
                  {isLoading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : isPlaying ? <Pause className="w-5 h-5 text-white" fill="white" /> : <Play className="w-5 h-5 text-white ml-0.5" fill="white" />}
                </button>
                <button onClick={playNext} disabled={!hasNext} className="p-2 text-slate-400 disabled:text-slate-700 hover:text-white">
                  <SkipForward className="w-5 h-5" fill="currentColor" />
                </button>

                {/* Desktop extras */}
                <div className="hidden sm:flex items-center gap-1 ml-2 border-l border-white/10 pl-2">
                  <button onClick={() => setRepeatMode(repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none')}
                    className={`p-2 rounded-lg ${repeatMode !== 'none' ? 'text-amber-400' : 'text-slate-500 hover:text-white'}`}>
                    {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setShowSpeed(!showSpeed); }}
                    className={`px-2 py-1 rounded-lg text-xs font-bold tracking-tight ${playbackRate !== 1 ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-white'}`}>
                    {playbackRate}x
                  </button>
                  <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setShowVolume(!showVolume); }} className="p-2 text-slate-500 hover:text-white">
                      {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    {showVolume && (
                      <div className="absolute bottom-full right-0 mb-2 bg-slate-800 rounded-xl p-3 shadow-xl border border-white/10" onClick={e => e.stopPropagation()}>
                        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-24 accent-amber-500" />
                      </div>
                    )}
                  </div>
                  <button onClick={() => setShowQueue(true)} className="p-2 text-slate-500 hover:text-white">
                    <ListMusic className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
