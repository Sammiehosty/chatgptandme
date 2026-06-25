import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Headphones, Sparkles } from 'lucide-react';
import { getSettings, type AppSettings } from '../api';

// Firework particle
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  trail: { x: number; y: number }[];
}

// Firework launcher
interface Firework {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  exploded: boolean;
  color: string;
}

const COLORS = [
  '#fbbf24', '#f59e0b', '#f97316', '#ef4444',
  '#ec4899', '#a855f7', '#6366f1', '#3b82f6',
  '#22d3ee', '#10b981', '#84cc16', '#ffffff',
];

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

async function createCelebrationSound() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') await ctx.resume();

  const playTone = (freq: number, start: number, dur: number, vol: number, type: OscillatorType = 'sine') => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
    gain.gain.setValueAtTime(0, ctx.currentTime + start);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + dur);
  };

  // Ascending sparkle chime
  const notes = [523, 659, 784, 1047, 1319, 1568];
  notes.forEach((f, i) => {
    playTone(f, i * 0.08, 0.6 - i * 0.05, 0.08, 'sine');
    playTone(f * 2, i * 0.08 + 0.02, 0.3, 0.03, 'sine');
  });

  // Warm pad
  [262, 330, 392, 523].forEach((f) => {
    playTone(f, 0.1, 1.2, 0.025, 'triangle');
  });

  // Shimmer
  for (let i = 0; i < 5; i++) {
    const f = 2000 + Math.random() * 3000;
    playTone(f, 0.5 + i * 0.12, 0.15, 0.01, 'sine');
  }

  // Resolution
  [523, 659, 784].forEach((f) => {
    playTone(f, 0.7, 1.5, 0.04, 'sine');
  });
}

async function playFirecrackerSound() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') await ctx.resume();

  // Pop / bang — short noise burst
  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    // Sharp attack, fast decay with noise
    const env = Math.exp(-i / (ctx.sampleRate * 0.015));
    data[i] = (Math.random() * 2 - 1) * env;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  // Bandpass filter for a crackle tone
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 800 + Math.random() * 2000;
  filter.Q.value = 0.5 + Math.random() * 1.5;

  const gain = ctx.createGain();
  gain.gain.value = 0.08 + Math.random() * 0.06;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();

  // Secondary crackle tail
  setTimeout(() => {
    const tailSize = ctx.sampleRate * 0.1;
    const tailBuf = ctx.createBuffer(1, tailSize, ctx.sampleRate);
    const tailData = tailBuf.getChannelData(0);
    for (let i = 0; i < tailSize; i++) {
      const env = Math.exp(-i / (ctx.sampleRate * 0.025));
      tailData[i] = (Math.random() * 2 - 1) * env * 0.4;
    }
    const tailSrc = ctx.createBufferSource();
    tailSrc.buffer = tailBuf;
    const tailGain = ctx.createGain();
    tailGain.gain.value = 0.05;
    tailSrc.connect(tailGain);
    tailGain.connect(ctx.destination);
    tailSrc.start();
  }, 30 + Math.random() * 50);
}

export default function LaunchPopup({
  onClose,
}: {
  onClose?: () => void;
}) {
  const [show, setShow] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({});
  const [closing, setClosing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const soundPlayed = useRef(false);

  useEffect(() => {
    getSettings().then(s => {
      setSettings(s);
      if (s.launch_popup_enabled !== '1') return;
      const popupVersion = settings.launch_popup_version || '1';

const dismissedVersion = localStorage.getItem(
  'sermon_launch_version'
);

if (dismissedVersion === popupVersion) return;
      setShow(true);
    });
  }, []);

  // Fireworks engine
  const spawnFirework = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    fireworksRef.current.push({
      x: Math.random() * canvas.width,
      y: canvas.height,
      targetY: canvas.height * 0.15 + Math.random() * canvas.height * 0.35,
      vy: -(6 + Math.random() * 4),
      exploded: false,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }, []);

  const explode = useCallback((fw: Firework) => {
    playFirecrackerSound();
    const count = 40 + Math.floor(Math.random() * 30);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.3;
      const speed = 1.5 + Math.random() * 3.5;
      particlesRef.current.push({
        x: fw.x,
        y: fw.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 60 + Math.random() * 40,
        color: Math.random() > 0.3 ? fw.color : COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 1.5 + Math.random() * 2,
        trail: [],
      });
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    // Update fireworks
    fireworksRef.current = fireworksRef.current.filter(fw => {
      if (fw.exploded) return false;
      fw.y += fw.vy;
      fw.vy += 0.05;

      // Draw trail
      ctx.beginPath();
      ctx.arc(fw.x, fw.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = fw.color;
      ctx.fill();

      if (fw.y <= fw.targetY || fw.vy >= 0) {
        fw.exploded = true;
        explode(fw);
        return false;
      }
      return true;
    });

    // Update particles
    particlesRef.current = particlesRef.current.filter(p => {
      p.life -= 1 / p.maxLife;
      if (p.life <= 0) return false;

      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 6) p.trail.shift();

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.vy += 0.03;

      // Draw trail
      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let i = 1; i < p.trail.length; i++) {
          ctx.lineTo(p.trail[i].x, p.trail[i].y);
        }
        ctx.strokeStyle = p.color.replace(')', `, ${p.life * 0.3})`).replace('rgb', 'rgba').replace('#', '');
        ctx.lineWidth = p.size * 0.5 * p.life;
        // Use hex color with alpha
        const alpha = (p.life * 0.3).toFixed(2);
        ctx.strokeStyle = `${p.color}${Math.round(parseFloat(alpha) * 255).toString(16).padStart(2, '0')}`;
        ctx.stroke();
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      const alphaHex = Math.round(p.life * 255).toString(16).padStart(2, '0');
      ctx.fillStyle = `${p.color}${alphaHex}`;
      ctx.fill();

      return true;
    });

    animFrameRef.current = requestAnimationFrame(animate);
  }, [explode]);

  // Start fireworks when shown
  useEffect(() => {
    if (!show || closing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Play sound once
    if (!soundPlayed.current) {
      soundPlayed.current = true;
      setTimeout(createCelebrationSound, 300);
    }

    // Launch fireworks in bursts
    const launchBurst = () => {
      const count = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        setTimeout(spawnFirework, i * 150);
      }
    };

    // Initial burst
    launchBurst();
    setTimeout(launchBurst, 800);
    setTimeout(launchBurst, 1600);

    // Continuous fireworks
    const interval = setInterval(() => {
      if (Math.random() > 0.3) launchBurst();
    }, 2000);

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      clearInterval(interval);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [show, closing, animate, spawnFirework]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      const popupVersion =
  settings.launch_popup_version || '1';

localStorage.setItem(
  'sermon_launch_version',
  popupVersion
);
      cancelAnimationFrame(animFrameRef.current);
      setShow(false);
setClosing(false);

onClose?.();
    }, 400);
  };

  if (!show) return null;

  const albumArt = settings.album_art_url || 'https://pst.sammiehosty.com/logo.jpg';
  const title = settings.launch_popup_title || 'We Are Live! 🎉';
  const subtitle = settings.launch_popup_subtitle || 'Welcome to our new sermon streaming platform';
  const description = settings.launch_popup_description || 'Listen to powerful, life-transforming sermons anytime, anywhere. Stream, search and be blessed by the Word of God.';
  const buttonText = settings.launch_popup_button_text || 'Start Listening';
  const launchDate = settings.launch_popup_date || '';

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-opacity duration-400 ${closing ? 'opacity-0' : 'opacity-100'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85" />

      {/* Fireworks canvas — behind popup */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Popup */}
      <div className={`relative w-full max-w-sm transition-all duration-500 z-20 ${closing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 rounded-[2rem] blur-xl" />

        <div className="relative bg-gradient-to-b from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />

          {/* Content */}
          <div className="px-6 pt-8 pb-6 text-center">
            {/* Logo */}
            <div className="relative mx-auto mb-5 w-24 h-24">
              <div className="absolute -inset-2 bg-gradient-to-br from-amber-400/30 to-orange-500/30 rounded-2xl blur-lg animate-pulse" />
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-xl shadow-amber-500/20 ring-2 ring-white/10">
                <img
                  src={albumArt}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Live badge */}
              <div className="absolute -top-1 -right-1 flex items-center gap-1 px-2 py-0.5 bg-green-500 rounded-full shadow-lg shadow-green-500/30">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-[9px] font-bold text-white uppercase tracking-wider">Live</span>
              </div>
            </div>

            {/* Date badge */}
            {launchDate && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span className="text-[11px] font-semibold text-amber-400 tracking-wider uppercase">{launchDate}</span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl font-bold text-white mb-2 font-serif-display tracking-tight leading-tight">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm font-semibold text-amber-400/90 mb-3 tracking-wide">
              {subtitle}
            </p>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
              <Headphones className="w-4 h-4 text-slate-500" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
            </div>

            {/* Description */}
            <p className="text-[13px] text-slate-400 leading-relaxed mb-6">
              {description}
            </p>

            {/* CTA Button */}
            <button
              onClick={handleClose}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:-translate-y-0.5 active:scale-[0.98] tracking-wide"
            >
              {buttonText}
            </button>

            {/* Footer text */}
            <p className="mt-4 text-[10px] text-slate-600 tracking-wide">
              {settings.church_name || 'VCC AWKA'} • {settings.pastor_name || 'Pst Ifeanyi'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
