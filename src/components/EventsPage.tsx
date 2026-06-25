import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2, CalendarDays } from 'lucide-react';
import { getSettings, type AppSettings } from '../api';

function getEventImagesFromSettings(s: AppSettings): string[] {
  const images: string[] = [];
  for (let i = 1; i <= 10; i++) {
    const img = s[`event_popup_image_${i}` as keyof AppSettings] as string;
    if (img && img.trim()) images.push(img.trim());
  }
  return images;
}

export default function EventsPage() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    getSettings().then(s => {
      setImages(getEventImagesFromSettings(s));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    autoRef.current = setInterval(() => setCurrent(c => (c + 1) % images.length), 5000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [images.length]);

  const restartAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    if (images.length <= 1) return;
    autoRef.current = setInterval(() => setCurrent(c => (c + 1) % images.length), 5000);
  };

  const goTo = (i: number) => { setCurrent(i); restartAuto(); };
  const prev = () => { setCurrent(c => (c - 1 + images.length) % images.length); restartAuto(); };
  const next = () => { setCurrent(c => (c + 1) % images.length); restartAuto(); };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>;

  if (images.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 flex items-center justify-center"><CalendarDays className="w-8 h-8 text-amber-400" /></div>
        <h2 className="text-xl font-bold text-white mb-2 font-display">Events</h2>
        <p className="text-slate-400 text-sm">No events available at the moment. Check back later!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4">
          <CalendarDays className="w-4 h-4 text-amber-400" />
          <span className="text-amber-400 text-xs font-semibold tracking-wider uppercase">Upcoming</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-display">Events</h1>
        <p className="text-slate-400 text-sm font-medium">Stay updated with our upcoming events and programs</p>
      </div>

      <div className="relative">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${current * 100}%)` }}>
            {images.map((img, i) => (
              <div key={i} className="w-full shrink-0">
                <img src={img} alt={`Event ${i + 1}`} className="w-full h-auto block" style={{ maxHeight: '70vh', objectFit: 'contain', margin: '0 auto' }} />
              </div>
            ))}
          </div>
        </div>
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur rounded-full flex items-center justify-center text-white"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur rounded-full flex items-center justify-center text-white"><ChevronRight className="w-5 h-5" /></button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mt-4">
            {images.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2 bg-amber-500' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`} />
            ))}
          </div>
          <p className="text-center text-xs text-slate-500 mt-3 tracking-wide">{current + 1} of {images.length} events</p>
        </div>
      )}

      {images.length > 1 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold text-white mb-4 font-display">All Events</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img, i) => (
              <button key={i} onClick={() => goTo(i)} className={`rounded-xl overflow-hidden border-2 transition-all ${i === current ? 'border-amber-500 shadow-lg shadow-amber-500/20' : 'border-white/10 hover:border-white/30'}`}>
                <img src={img} alt={`Event ${i + 1}`} className="w-full h-32 sm:h-40 object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
