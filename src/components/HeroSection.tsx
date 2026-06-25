import { Play, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { AppStats } from '../types';
import { getSettings } from '../api';

interface HeroProps {
  stats: AppStats | null;
  onNavigate: (view: string) => void;
}

export default function HeroSection({ stats, onNavigate }: HeroProps) {
  const [pastorName, setPastorName] = useState('Pst Ifeanyi');

  useEffect(() => {
    getSettings().then(settings => {
      if (settings.pastor_name) {
        setPastorName(settings.pastor_name);
      }
    });
  }, []);
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("https://images.pexels.com/photos/8815003/pexels-photo-8815003.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px)'
        }} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-400 text-xs font-semibold tracking-wide uppercase">Live from Telegram</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 font-display">
            {pastorName}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Sermon Library
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Access powerful, life-transforming sermons anytime, anywhere. 
            Be blessed and grow in the Word of God.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <button
              onClick={() => onNavigate('sermons')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-200 hover:shadow-amber-500/40 hover:-translate-y-0.5"
            >
              <Play className="w-5 h-5" fill="white" />
              Start Listening
            </button>
            <button
              onClick={() => onNavigate('browse')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Calendar className="w-5 h-5" />
              Browse by Month
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <StatCard icon="🎙" value={stats.total_sermons} label="Sermons" />
              <StatCard icon="▶️" value={stats.total_plays.toLocaleString()} label="Total Plays" />
              <StatCard icon="⏱" value={stats.total_duration_formatted} label="Total Hours" />
              <StatCard icon="📅" value={stats.latest_sermon_date} label="Latest" small />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, value, label, small }: { icon: string; value: string | number; label: string; small?: boolean }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/5">
      <div className="text-lg mb-1">{icon}</div>
      <div className={`${small ? 'text-sm' : 'text-xl'} font-bold text-white`}>{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}
