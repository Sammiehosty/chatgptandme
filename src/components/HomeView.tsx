import { useState, useEffect } from 'react';
import { ChevronRight, Loader2, TrendingUp, Clock, Sparkles } from 'lucide-react';
import type { Sermon, AppStats } from '../types';
// FIX 1: Added getContinueListening to the API imports
import { getSermons, getStats, getSettings, getContinueListening } from '../api'; 
import HeroSection from './HeroSection';
import SermonCard from './SermonCard';
import ContinueListeningCard from './ContinueListeningCard';

interface HomeViewProps {
  onNavigate: (view: string) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const [stats, setStats] = useState<AppStats | null>(null);
  const [latestSermons, setLatestSermons] = useState<Sermon[]>([]);
  const [popularSermons, setPopularSermons] = useState<Sermon[]>([]);
  const [continueSermon, setContinueSermon] = useState<Sermon | null>(null);
  const [continueProgress, setContinueProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [telegramLink, setTelegramLink] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [
          statsData,
          latestData,
          popularData,
          settingsData,
          continueData
        ] = await Promise.all([
          getStats(),
          getSermons({ limit: 6, sort: 'newest' }),
          getSermons({ limit: 6, sort: 'popular' }),
          getSettings(),
          getContinueListening()
        ]);

        setStats(statsData);
        setLatestSermons(latestData.sermons);
        setPopularSermons(popularData.sermons);
        setTelegramLink(settingsData.telegram_channel_link || '');

        // FIX 3: Verify if continueData.progress should actually be continueData.sermon based on your types
        if (continueData.success && continueData.progress) {
          setContinueSermon(continueData.progress); 
          setContinueProgress(Number(continueData.progress.completion_percent || 0));
        }
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

      {/* FIX 2: Removed the first duplicate ContinueListeningCard from here */}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          
          {/* We only render this card if a continuation sermon exists */}
          {continueSermon && (
            <div className="mb-8">
              <ContinueListeningCard 
                sermon={continueSermon} 
                progress={continueProgress} 
                onResume={() => {}} 
              />
            </div>
          )}

          {/* Latest Sermons */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Latest Sermons
                </h2>
              </div>
              <button 
                onClick={() => onNavigate('sermons')} 
                className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div> 

            {latestSermons.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <SermonCard key={latestSermons[0].id} sermon={latestSermons[0]} sermonList={latestSermons} variant="featured" />
                {latestSermons[1] && (
                  <SermonCard key={latestSermons[1].id} sermon={latestSermons[1]} sermonList={latestSermons} variant="featured" />
                )}
              </div>
            )}

            {latestSermons.length > 2 && (
              <div className="bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden">
                {latestSermons.slice(2).map((sermon) => (
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
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Most Popular
                </h2>
              </div>
              <button 
                onClick={() => onNavigate('sermons')} 
                className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularSermons.map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} sermonList={popularSermons} />
              ))}
            </div>
          </section>

          {telegramLink && (
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/10 p-8 sm:p-10 text-center">
              <div className="absolute top-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl" />
              <div className="relative">
                <Clock className="w-10 h-10 text-amber-400 mx-auto mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 font-display">
                  Never Miss a Sermon
                </h3>
                <p className="text-slate-400 max-w-md mx-auto mb-6">
                  All sermons are automatically synced from our Telegram channel.
                </p>
                <a 
                  href={telegramLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold rounded-xl"
                >
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
