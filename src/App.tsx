import { useState, useCallback, useEffect } from 'react';
import { PlayerProvider, usePlayer } from './PlayerContext';
import Header from './components/Header';
import HomeView from './components/HomeView';
import SermonList from './components/SermonList';
import ContactPage from './components/ContactPage';
import FacebookFeeds from './components/FacebookFeeds';
import EventsPage from './components/EventsPage';
import TestimoniesPage from './components/TestimoniesPage';
import ArticlePage from './components/ArticlePage';
import AudioPlayer from './components/AudioPlayer';
import InstallPrompt from './components/InstallPrompt';
import LaunchPopup from './components/LaunchPopup';
import EventPopup from './components/EventPopup';
import MaintenancePage from './components/MaintenancePage';
import { getSettings } from './api';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const [currentView, setCurrentView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [pastorName, setPastorName] = useState('Pst Ifeanyi');
  const [isLoading, setIsLoading] = useState(true);
  const [albumArt, setAlbumArt] = useState('https://pst.sammiehosty.com/logo.jpg');
  const { currentSermon } = usePlayer();
const { user } = useAuth();
const [settings, setSettings] = useState<any>(null);
const [launchDismissed, setLaunchDismissed] = useState(false);



   const registerVisit = async () => {
let deviceId = localStorage.getItem('pst_sermon_device_id');

if (!deviceId) {
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const txt = 'pst_sermon_v1';

ctx!.textBaseline = 'top';
ctx!.font = "14px 'Arial'";
ctx!.textBaseline = 'alphabetic';
ctx!.fillStyle = '#f60';
ctx!.fillRect(125, 1, 62, 20);
ctx!.fillStyle = '#069';
ctx!.fillText(txt, 2, 15);
ctx!.fillStyle = 'rgba(102, 204, 0, 0.7)';
ctx!.fillText(txt, 4, 17);

const b64 = canvas.toDataURL().slice(-50);

deviceId =
  b64 +
  Math.random().toString(36).substring(2, 15) +
  Date.now().toString(36);

localStorage.setItem(
  'pst_sermon_device_id',
  deviceId
);

document.cookie =
  `pst_device_id=${deviceId}; max-age=${
    60 * 60 * 24 * 365 * 2
  }; path=/`;


}

try {
await fetch(
'https://vcc.sammiehosty.com/api/visitor.php',
{
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({
device_id: deviceId,
}),
}
);
} catch (err) {
console.error(
'Visit registration failed',
err
);
}
};

useEffect(() => {
getSettings().then(settings => {
setSettings(settings);


if (settings.pastor_name)
  setPastorName(settings.pastor_name);

if (settings.album_art_url)
  setAlbumArt(settings.album_art_url);

if (settings.preloader_enabled === '1') {
  const time =
    parseInt(
      settings.preloader_time || '3',
      10
    ) * 1000;

  setTimeout(
    () => setIsLoading(false),
    time
  );
} else {
  setIsLoading(false);
}


});

registerVisit();
}, []);

useEffect(() => {
const handleLogin = () => {
setCurrentView('home');
};

window.addEventListener(
'login-success',
handleLogin
);

return () => {
window.removeEventListener(
'login-success',
handleLogin
);
};
}, []);
 
    
  

  const handleNavigate = useCallback((view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setCurrentView('sermons');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[500] bg-slate-950 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-amber-500/20 rounded-full blur-2xl animate-pulse" />
          <img 
            src={albumArt} 
            alt="Logo" 
            className="w-24 h-24 rounded-3xl object-cover relative z-10 shadow-2xl animate-in zoom-in duration-700" 
          />
        </div>
        <div className="mt-8 flex flex-col items-center">
          <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 animate-loading-bar" />
          </div>
          <p className="mt-4 text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] animate-pulse">Initializing</p>
        </div>
      </div>
    );
  }
if (settings?.maintenance_mode === '1') {
  return <MaintenancePage />;
}


if (
  settings?.launch_popup_enabled === '1' &&
  !launchDismissed
) {
  return (
    <LaunchPopup
      onClose={() => setLaunchDismissed(true)}
    />
  );
}


if (!user) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {currentView === 'register' ? (
          <>
            <Register />

            <div className="text-center mt-4">
              <button
                onClick={() => setCurrentView('login')}
                className="text-amber-400"
              >
                Already have an account? Login
              </button>
            </div>
          </>
        ) : (
          <>
            <Login />

            <div className="text-center mt-4">
              <button
                onClick={() => setCurrentView('register')}
                className="text-amber-400"
              >
                Create Account
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}




  return (
    <div className="min-h-screen bg-slate-950 text-white animate-in fade-in duration-700">
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      <main className={currentSermon ? 'pb-24' : ''}>

       

{currentView === 'favorites' && (
  <Favorites />
)}
        {currentView === 'home' && (
          <HomeView onNavigate={handleNavigate} />
        )}
        {currentView === 'sermons' && (
          <SermonList searchQuery={searchQuery} view="sermons" />
        )}
        {currentView === 'browse' && (
          <SermonList searchQuery={searchQuery} view="browse" />
        )}
        {currentView === 'events' && (
          <EventsPage />
        )}
        {currentView === 'testimonies' && (
          <TestimoniesPage />
        )}
        {currentView === 'articles' && (
          <ArticlePage />
        )}
        {currentView === 'facebook' && (
          <FacebookFeeds />
        )}
        {currentView === 'contact' && (
          <ContactPage />
        )}
       
      </main>

      <AudioPlayer />
      <InstallPrompt />
      <EventPopup />

      {/* Footer */}
      {!currentSermon && (
        <footer className="border-t border-white/5 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <span className="text-sm">✝</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{pastorName} Sermon</p>
                  <p className="text-xs text-slate-500">Listen & Be Blessed</p>
                </div>
              </div>
              <p className="text-xs text-slate-600">
                © {new Date().getFullYear()} {pastorName} Sermon Library. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
}
