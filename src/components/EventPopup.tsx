import { useState, useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import { getSettings, type AppSettings } from '../api';

interface EventItem {
  image: string;
  time: number;
  index: number;
}

function getEventsFromSettings(s: AppSettings): EventItem[] {
  const events: EventItem[] = [];
  for (let i = 1; i <= 10; i++) {
    const img = s[`event_popup_image_${i}` as keyof AppSettings] as string;
    const time = parseInt(s[`event_popup_time_${i}` as keyof AppSettings] as string || '0', 10);
    if (img && img.trim()) {
      events.push({ image: img.trim(), time: time || (i * 15), index: i });
    }
  }
  return events;
}

export default function EventPopup() {
  const [currentEvent, setCurrentEvent] = useState<EventItem | null>(null);
  const [closing, setClosing] = useState(false);
  const shownRef = useRef<Set<number>>(new Set());
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scheduleEvents = useCallback((settings: AppSettings) => {
    if (settings.event_popup_enabled !== '1') return;

    const allEvents = getEventsFromSettings(settings);
    if (allEvents.length === 0) return;

    const mode = settings.event_popup_mode || 'timed';

    // Clear old timers
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];

    if (mode === 'random') {
      const pickRandom = () => {
        const available = allEvents.filter(e => !shownRef.current.has(e.index));
        if (available.length === 0) {
          shownRef.current.clear();
          return allEvents[Math.floor(Math.random() * allEvents.length)];
        }
        return available[Math.floor(Math.random() * available.length)];
      };

      const delay = 3000 + Math.random() * 12000;
      const t = setTimeout(() => {
        setCurrentEvent(pickRandom());
      }, delay);
      timersRef.current.push(t);
    } else {
      const sorted = [...allEvents].sort((a, b) => a.time - b.time);
      sorted.forEach(evt => {
        const t = setTimeout(() => {
          if (!shownRef.current.has(evt.index)) {
            setCurrentEvent(evt);
          }
        }, evt.time * 1000);
        timersRef.current.push(t);
      });
    }
  }, []);

  useEffect(() => {
    getSettings().then(s => scheduleEvents(s));
    return () => timersRef.current.forEach(t => clearTimeout(t));
  }, [scheduleEvents]);

  const dismiss = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      if (currentEvent) {
        shownRef.current.add(currentEvent.index);
      }
      setCurrentEvent(null);
      setClosing(false);

      getSettings().then(s => {
        if (s.event_popup_enabled !== '1') return;
        const allEvents = getEventsFromSettings(s);
        const mode = s.event_popup_mode || 'timed';

        if (mode === 'random') {
          const available = allEvents.filter(e => !shownRef.current.has(e.index));
          if (available.length === 0) shownRef.current.clear();
          const pool = available.length > 0 ? available : allEvents;
          const pick = pool[Math.floor(Math.random() * pool.length)];
          const delay = 10000 + Math.random() * 20000;
          const t = setTimeout(() => setCurrentEvent(pick), delay);
          timersRef.current.push(t);
        } else {
          const sorted = [...allEvents].sort((a, b) => a.time - b.time);
          const next = sorted.find(e => !shownRef.current.has(e.index));
          if (next) {
            const t = setTimeout(() => setCurrentEvent(next), 5000);
            timersRef.current.push(t);
          }
        }
      });
    }, 300);
  }, [currentEvent]);

  if (!currentEvent) return null;

  return (
    <div className={`fixed inset-0 z-[180] flex items-center justify-center p-4 transition-opacity duration-300 ${closing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={dismiss} />
      <div className={`relative w-full max-w-lg transition-all duration-400 ${closing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        <button onClick={dismiss} className="absolute -top-3 -right-3 z-10 w-9 h-9 bg-slate-800 border border-white/20 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-all shadow-xl">
          <X className="w-4 h-4" />
        </button>
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <img src={currentEvent.image} alt="Event" className="w-full h-auto block" style={{ maxHeight: '80vh', objectFit: 'contain', background: '#0f172a' }} />
        </div>
        <button onClick={dismiss} className="w-full mt-3 py-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-semibold rounded-xl transition-all tracking-wide">
          Dismiss
        </button>
      </div>
    </div>
  );
}
