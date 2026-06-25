import { useState, useEffect } from 'react';
import { X, Download, Share, Plus, MoreVertical, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [deviceType, setDeviceType] = useState<'android' | 'ios' | 'desktop' | 'unknown'>('unknown');
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed as PWA
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');
    
    setIsStandalone(isInStandaloneMode);

    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setDeviceType('ios');
    } else if (/android/.test(userAgent)) {
      setDeviceType('android');
    } else if (/windows|macintosh|linux/.test(userAgent) && !/mobile/.test(userAgent)) {
      setDeviceType('desktop');
    }

    // Check if first visit
    const hasVisited = localStorage.getItem('pst_ifeanyi_visited');
    const installDismissed = localStorage.getItem('pst_ifeanyi_install_dismissed');
    
    if (!hasVisited) {
      localStorage.setItem('pst_ifeanyi_visited', 'true');
    }

    // Show prompt on first visit or if not dismissed recently
    const dismissedTime = installDismissed ? parseInt(installDismissed) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
    
    if (!isInStandaloneMode && (!installDismissed || daysSinceDismissed > 7)) {
      // Delay showing prompt
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Listen for beforeinstallprompt (Android/Desktop Chrome)
    const handleBeforeInstall = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Android/Chrome install
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pst_ifeanyi_install_dismissed', Date.now().toString());
    setShowPrompt(false);
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleDismiss}
      />
      
      {/* Bottom Sheet */}
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-800 to-slate-900 rounded-t-2xl shadow-2xl overflow-hidden pb-safe">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-600" />
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="px-5 pb-6 pt-2 text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Smartphone className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-lg font-bold text-white mb-1">Install Our App</h2>
          <p className="text-slate-400 text-xs mb-4">
            Get quick access to sermons. Install for a better experience!
          </p>

          {/* Device-specific instructions */}
          {deviceType === 'ios' && (
            <div className="bg-slate-700/50 rounded-xl p-3 mb-4 text-left">
              <p className="text-xs text-white font-medium mb-2">To install on iPhone/iPad:</p>
              <ol className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0 text-white text-[10px] font-bold mt-0.5">1</span>
                  <span>Tap <Share className="w-3.5 h-3.5 inline text-blue-400 mx-0.5" /> Share at the bottom of Safari</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0 text-white text-[10px] font-bold mt-0.5">2</span>
                  <span>Tap <Plus className="w-3.5 h-3.5 inline text-slate-300 mx-0.5" /> <strong>"Add to Home Screen"</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0 text-white text-[10px] font-bold mt-0.5">3</span>
                  <span>Tap <strong>"Add"</strong></span>
                </li>
              </ol>
            </div>
          )}

          {deviceType === 'android' && !deferredPrompt && (
            <div className="bg-slate-700/50 rounded-xl p-3 mb-4 text-left">
              <p className="text-xs text-white font-medium mb-2">To install on Android:</p>
              <ol className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0 text-white text-[10px] font-bold mt-0.5">1</span>
                  <span>Tap <MoreVertical className="w-3.5 h-3.5 inline text-slate-300 mx-0.5" /> menu in Chrome</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0 text-white text-[10px] font-bold mt-0.5">2</span>
                  <span>Tap <strong>"Install app"</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0 text-white text-[10px] font-bold mt-0.5">3</span>
                  <span>Tap <strong>"Install"</strong></span>
                </li>
              </ol>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              className="flex-1 px-4 py-3 rounded-xl text-slate-300 font-medium hover:bg-white/5 transition-colors"
            >
              Maybe Later
            </button>
            
            {deferredPrompt ? (
              <button
                onClick={handleInstall}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Install Now
              </button>
            ) : (
              <button
                onClick={handleDismiss}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
              >
                Got It!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for triggering install from menu
export function useInstallApp() {
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [deviceType, setDeviceType] = useState<'android' | 'ios' | 'desktop' | 'unknown'>('unknown');
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setDeviceType('ios');
      setCanInstall(true);
    } else if (/android/.test(userAgent)) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }

    // Check if already installed
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone;
    
    if (isInStandaloneMode) {
      setCanInstall(false);
      return;
    }

    const handleBeforeInstall = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const triggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      setShowInstructions(true);
    }
  };

  return { canInstall, deviceType, triggerInstall, showInstructions, setShowInstructions };
}
