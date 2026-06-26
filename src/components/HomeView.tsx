import { useState, useEffect } from 'react';
import { ChevronRight, Loader2, TrendingUp, Clock, Sparkles } from 'lucide-react';
import type { Sermon, AppStats } from '../types';
import { getSermons, getStats, getSettings } from '../api';
import HeroSection from './HeroSection';
import SermonCard from './SermonCard';
import ContinueListeningCard from "./ContinueListeningCard";

interface HomeViewProps {
  onNavigate: (view: string) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const [stats, setStats] = useState<AppStats | null>(null);
  const [latestSermons, setLatestSermons] = useState<Sermon[]>([]);
  const [popularSermons, setPopularSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [telegramLink, setTelegramLink] = useState('');
  const [continueSermon, setContinueSermon] = useState<Sermon | null>(null);

const [continueProgress, setContinueProgress] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [statsData, latestData, popularData, settingsData] = await Promise.all([
          getStats(),
          getSermons({ limit: 6, sort: 'newest' }),
          getSermons({ limit: 6, sort: 'popular' }),
          getSettings(),
        ]);
        setStats(statsData);
        setLatestSermons(latestData.sermons);
        setPopularSermons(popularData.sermons);
        setTelegramLink(settingsData.telegram_channel_link || '');
      } catch (err) {
        console.error('Error loading home data:', err);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div>
      <HeroSection stats={stats} onNavigate={onNavigate} />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Latest Sermons */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">Latest Sermons</h2>
              </div>
              <button
                onClick={() => onNavigate('sermons')}
                className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            {/* Featured sermon */}
            {latestSermons.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <SermonCard sermon={latestSermons[0]} sermonList={latestSermons} variant="featured" />
                {latestSermons[1] && (
                  <SermonCard sermon={latestSermons[1]} sermonList={latestSermons} variant="featured" />
                )}
              </div>
            )}

            {/* More sermons in compact */}
            {latestSermons.length > 2 && (
              <div className="bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden">
                {latestSermons.slice(2).map(sermon => (
                  <SermonCard key={sermon.id} sermon={sermon} sermonList={latestSermons} variant="compact" />
                ))}
              </div>
            )}
          </section>

          {/* Popular Sermons */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">Most Popular</h2>
              </div>
              <button
                onClick={() => onNavigate('sermons')}
                className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularSermons.map(sermon => (
                <SermonCard key={sermon.id} sermon={sermon} sermonList={popularSermons} />
              ))}
            </div>
          </section>

          {/* CTA Banner */}
          {telegramLink && (
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/10 p-8 sm:p-10 text-center">
              <div className="absolute top-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl" />
              <div className="relative">
                <Clock className="w-10 h-10 text-amber-400 mx-auto mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 font-display">Never Miss a Sermon</h3>
                <p className="text-slate-400 max-w-md mx-auto mb-6">
                  All sermons are automatically synced from our Telegram channel. 
                  Join the channel to get notified of new messages.
                </p>
                <a
                  href={telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  Join Telegram Channel
                </a>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
