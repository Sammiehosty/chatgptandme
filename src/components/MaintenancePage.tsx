import { useState, useEffect } from 'react';
import { Construction, Wrench } from 'lucide-react';
import { getSettings, type AppSettings } from '../api';

export default function MaintenancePage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  useEffect(() => {
    if (!settings?.maintenance_date) return;

    const interval = setInterval(() => {
      const end = new Date(settings.maintenance_date!).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setCountdown('Are You Ready?');
        clearInterval(interval);
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown(`${d} Days, ${h} Hours, ${m} Minutes, ${s} Seconds to go`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settings?.maintenance_date]);

  if (!settings) return null;
  if (settings.maintenance_mode !== '1') return null;

  const albumArt = settings.album_art_url || 'https://pst.sammiehosty.com/logo.jpg';
  const title = settings.maintenance_title || 'Under Construction';
  const description = settings.maintenance_description || 'We are working hard to bring you something amazing. Please check back soon!';

  return (
    <div className="fixed inset-0 z-[300] bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        {/* Animated stripes */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, #f59e0b 40px, #f59e0b 42px)',
          animation: 'stripe-move 3s linear infinite',
        }} />
      </div>

      <div className="relative text-center max-w-md">
        {/* Logo */}
        <div className="relative mx-auto mb-8 w-28 h-28">
          <div className="absolute -inset-3 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-3xl blur-xl animate-pulse" />
          <div className="relative w-28 h-28 rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/10 ring-2 ring-white/10">
            <img src={albumArt} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Wrench className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Icon */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
          <Construction className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Under Construction</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-serif-display tracking-tight leading-tight">
          {title}
        </h1>

        {/* Description */}
        <p className="text-slate-400 leading-relaxed mb-6">
          {description}
        </p>

        {/* Countdown */}
        {countdown && (
          <div className="mb-8">
            <p className="text-amber-500 font-bold tracking-[0.1em] text-sm uppercase mb-2">Countdown</p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <span className="text-[16px] sm:text-xl font-bold text-white tabular-nums">
                {countdown}
              </span>
            </div>
          </div>
        )}

        {/* Animated dots */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-amber-400"
              style={{
                animation: 'bounce-dot 1.4s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* Footer */}
        <p className="mt-10 text-[11px] text-slate-600 tracking-wide">
          {settings.church_name || 'VCC AWKA'} • {settings.pastor_name || 'Pst Ifeanyi'}
        </p>
      </div>

      <style>{`
        @keyframes stripe-move {
          0% { background-position: 0 0; }
          100% { background-position: 84px 0; }
        }
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
