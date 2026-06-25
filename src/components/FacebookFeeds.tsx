import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { getSettings } from '../api';

export default function FacebookFeeds() {
  const [fbUsername, setFbUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(390);

  // Load settings
  useEffect(() => {
    getSettings().then(s => {
      setFbUsername(s.facebook_username || '');
      setLoading(false);
    });
  }, []);

  // Measure container width for responsive embed
  const measureWidth = useCallback(() => {
    if (containerRef.current) {
      const w = containerRef.current.offsetWidth;
      setContainerWidth(Math.min(Math.max(w - 2, 180), 500));
    }
  }, []);

  useEffect(() => {
    measureWidth();
    window.addEventListener('resize', measureWidth);
    return () => window.removeEventListener('resize', measureWidth);
  }, [measureWidth]);

  // Load Facebook SDK
  useEffect(() => {
    if (!fbUsername) return;

    const existingScript = document.getElementById('facebook-jssdk');
    if (existingScript) {
      // SDK already loaded, just re-parse
      if ((window as any).FB) {
        (window as any).FB.XFBML.parse();
        setSdkLoaded(true);
      }
      return;
    }

    // Insert Facebook SDK
    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v21.0';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      setSdkLoaded(true);
    };
    document.body.appendChild(script);

    // Also add the fb-root div if missing
    if (!document.getElementById('fb-root')) {
      const fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';
      document.body.prepend(fbRoot);
    }
  }, [fbUsername]);

  // Re-parse when username changes or SDK loads
  useEffect(() => {
    if (sdkLoaded && fbUsername && (window as any).FB) {
      setTimeout(() => {
        (window as any).FB.XFBML.parse();
      }, 300);
    }
  }, [sdkLoaded, fbUsername, containerWidth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!fbUsername) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2 font-display">Facebook Feeds</h2>
        <p className="text-slate-400 text-sm">Facebook page not configured yet. Admin can set this up in the dashboard.</p>
      </div>
    );
  }

  const pageUrl = `https://www.facebook.com/${fbUsername}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
          <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span className="text-blue-400 text-xs font-semibold tracking-wider uppercase">Facebook</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-display">Facebook Feeds</h1>
        <p className="text-slate-400 text-sm">Stay updated with our latest posts and announcements</p>
      </div>

      {/* Facebook Page Plugin */}
      <div ref={containerRef} className="flex justify-center">
        <div
          className="fb-page"
          data-href={pageUrl}
          data-tabs="timeline"
          data-width={containerWidth}
          data-height="800"
          data-small-header="false"
          data-adapt-container-width="true"
          data-hide-cover="false"
          data-show-facepile="true"
        >
          <blockquote cite={pageUrl} className="fb-xfbml-parse-ignore">
            <a href={pageUrl} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              Visit our Facebook Page
            </a>
          </blockquote>
        </div>
      </div>

      {/* Fallback link */}
      <div className="mt-8 text-center">
        <a
          href={pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Visit on Facebook
        </a>
      </div>
    </div>
  );
}
