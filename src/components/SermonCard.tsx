import { Play, Pause, Clock, Calendar, BarChart2, Heart } from 'lucide-react';
import type { Sermon } from '../types';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../PlayerContext';

interface SermonCardProps {
  sermon: Sermon;
  sermonList: Sermon[];
  variant?: 'default' | 'compact' | 'featured';
}

export default function SermonCard({ sermon, sermonList, variant = 'default' }: SermonCardProps) {
  const { play, currentSermon, isPlaying, togglePlay } = usePlayer();
  const isCurrentSermon = currentSermon?.id === sermon.id;
  const { user } = useAuth();

const [isFavorite, setIsFavorite] = useState(false);

useEffect(() => {
  if (!user) return;

  checkFavorite();
}, [user]);

const checkFavorite = async () => {
  try {
    const response = await fetch(
      `https://vcc.sammiehosty.com/api/favorites.php?action=list&user_id=${user?.id}`
    );

    const data = await response.json();

    if (data.success && data.sermons) {
      setIsFavorite(
        data.sermons.some(
          (s: any) => Number(s.id) === Number(sermon.id)
        )
      );
    }
  } catch (err) {
    console.error(err);
  }
};

const toggleFavorite = async (
  e: React.MouseEvent<HTMLButtonElement>
) => {
  e.stopPropagation();

  if (!user) {
    alert('Please login first');
    return;
  }

  try {
    const formData = new FormData();

    formData.append(
      'user_id',
      user.id.toString()
    );

    formData.append(
      'sermon_id',
      sermon.id.toString()
    );

    const action = isFavorite
      ? 'remove'
      : 'add';

    const response = await fetch(
      `https://vcc.sammiehosty.com/api/favorites.php?action=${action}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    console.log(data);

    if (data.success) {
      setIsFavorite(!isFavorite);
    } else {
      alert(data.message || 'Failed');
    }
  } catch (error) {
    console.error(error);
    alert('Unable to save favorite');
  }
};


  const handleClick = () => {
    if (isCurrentSermon) {
      togglePlay();
    } else {
      play(sermon, sermonList);
    }
  };

  // Generate a color based on sermon id
  const colors = [
    'from-amber-500/20 to-orange-500/20 border-amber-500/10',
    'from-indigo-500/20 to-purple-500/20 border-indigo-500/10',
    'from-emerald-500/20 to-teal-500/20 border-emerald-500/10',
    'from-rose-500/20 to-pink-500/20 border-rose-500/10',
    'from-sky-500/20 to-cyan-500/20 border-sky-500/10',
    'from-violet-500/20 to-fuchsia-500/20 border-violet-500/10',
  ];
  const colorClass = colors[sermon.id % colors.length];

  const iconColors = [
    'from-amber-400 to-orange-500',
    'from-indigo-400 to-purple-500',
    'from-emerald-400 to-teal-500',
    'from-rose-400 to-pink-500',
    'from-sky-400 to-cyan-500',
    'from-violet-400 to-fuchsia-500',
  ];
  const iconColor = iconColors[sermon.id % iconColors.length];

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group text-left ${
          isCurrentSermon
            ? 'bg-amber-500/10 border border-amber-500/20'
            : 'hover:bg-white/5 border border-transparent'
        }`}
      >
        {/* Play button */}
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${iconColor} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
          {isCurrentSermon && isPlaying ? (
            <Pause className="w-4 h-4 text-white" fill="white" />
          ) : (
            <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold truncate ${isCurrentSermon ? 'text-amber-400' : 'text-white'}`}>
            {sermon.title}
          </h3>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {sermon.date_formatted}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {sermon.duration_formatted}
            </span>
          </div>
        </div>

        {/* Play count */}
        <div className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
          <BarChart2 className="w-3 h-3" />
          {sermon.play_count}
        </div>
      </button>
    );
  }

  if (variant === 'featured') {
    return (
      <button
        onClick={handleClick}
        className={`w-full text-left group relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorClass} border p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20`}
      >
        {isCurrentSermon && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] text-amber-400 font-semibold">NOW PLAYING</span>
            </div>
          </div>
        )}

        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${iconColor} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {isCurrentSermon && isPlaying ? (
            <Pause className="w-6 h-6 text-white" fill="white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
          )}
        </div>

        <h3 className={`text-base sm:text-lg font-bold mb-2 line-clamp-2 ${isCurrentSermon ? 'text-amber-400' : 'text-white'}`}>
          {sermon.title}
        </h3>

        {sermon.description && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-3">{sermon.description}</p>
        )}

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {sermon.date_formatted}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {sermon.duration_formatted}
          </span>
          <span className="flex items-center gap-1">
            <BarChart2 className="w-3 h-3" />
            {sermon.play_count} plays
          </span>
        </div>
      </button>
    );
  }

  // Default card
  return (
    <button
      onClick={handleClick}
      className={`w-full text-left group relative overflow-hidden rounded-xl bg-gradient-to-br ${colorClass} border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10`}
    >
      {isCurrentSermon && (
        <div className="absolute top-2 right-2">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[9px] text-amber-400 font-semibold">PLAYING</span>
          </div>
        </div>
      )}


      <div className="absolute top-2 left-2 z-20">
  <button
    onClick={toggleFavorite}
    className="p-2 rounded-full bg-black/30 hover:bg-black/50"
  >
    <Heart
      className={`w-4 h-4 ${
        isFavorite
          ? 'text-red-500 fill-red-500'
          : 'text-white'
      }`}
    />
  </button>
</div>

      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${iconColor} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {isCurrentSermon && isPlaying ? (
            <Pause className="w-5 h-5 text-white" fill="white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-bold mb-1 line-clamp-2 ${isCurrentSermon ? 'text-amber-400' : 'text-white group-hover:text-amber-300'} transition-colors`}>
            {sermon.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {sermon.date_formatted}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {sermon.duration_formatted}
            </span>
            <span className="flex items-center gap-1">
              <BarChart2 className="w-3 h-3" />
              {sermon.play_count}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
