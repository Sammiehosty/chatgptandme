import { Search, Menu, X, Sparkles, Clock, TrendingUp, Calendar, Music, Phone, Rss, CalendarDays, Heart, BookOpen, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSettings } from '../api';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

export default function Header({ searchQuery, onSearchChange, onNavigate, currentView }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [churchName, setChurchName] = useState('VCC AWKA');
  const [pastorName, setPastorName] = useState('Pst Ifeanyi');
  const [testimoniesEnabled, setTestimoniesEnabled] = useState(true);
  const [articlesEnabled, setArticlesEnabled] = useState(true);
  const [articlesText, setArticlesText] = useState('Articles');
  const { user, logout } = useAuth();

  useEffect(() => {
    getSettings().then(settings => {
      if (settings.church_name) setChurchName(settings.church_name);
      if (settings.pastor_name) setPastorName(settings.pastor_name);
      setTestimoniesEnabled(settings.testimonies_enabled === '1');
      setArticlesEnabled(settings.article_menu_enabled === '1');
      if (settings.article_menu_text) setArticlesText(settings.article_menu_text);
    });
  }, []);

 const navItems = [
  { id: 'home', label: 'Home', icon: Music },
  { id: 'sermons', label: 'All Sermons', icon: Music },
  { id: 'browse', label: 'Browse by Month', icon: Calendar },
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'testimonies', label: 'Testimonies', icon: Heart, hidden: !testimoniesEnabled },
  { id: 'articles', label: articlesText, icon: BookOpen, hidden: !articlesEnabled },
  { id: 'facebook', label: 'Facebook Feeds', icon: Rss },
  { id: 'contact', label: 'Contact', icon: Phone },
].filter(item => !item.hidden);

  const menuItems = [
    { id: 'newest', label: 'Newest Sermons', icon: Sparkles, sort: 'newest' },
    { id: 'oldest', label: 'Oldest Sermons', icon: Clock, sort: 'oldest' },
    { id: 'popular', label: 'Popular Sermons', icon: TrendingUp, sort: 'popular' },
  ];

  const handleMenuClick = (item: typeof menuItems[0]) => {
    onNavigate('sermons');
    // Dispatch custom event to set sort
    window.dispatchEvent(new CustomEvent('setSermonSort', { detail: item.sort }));
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 via-indigo-950/95 to-slate-900/95 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-lg">✝</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white leading-tight font-display">{pastorName}</h1>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-amber-500/20 rounded text-[10px] font-bold text-amber-400 uppercase tracking-wide">
                  {churchName}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide sm:hidden">{churchName}</p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === item.id
                    ? 'text-white bg-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

        {/* User Account Section */}
<div className="hidden md:flex items-center gap-3">
  {!user ? (
    <>
      <button
        onClick={() => onNavigate('login')}
        className="text-sm text-slate-300 hover:text-white"
      >
        Login
      </button>

      <button
        onClick={() => onNavigate('register')}
        className="px-4 py-2 rounded-lg bg-amber-500 text-black text-sm font-semibold hover:bg-amber-400"
      >
        Create Account
      </button>
    </>
  ) : (
    <>
      <span className="text-sm font-medium text-amber-400">
        {user.fullname}
      </span>


<button
    onClick={() => onNavigate("dashboard")}
    className={...}
>
    Dashboard
</button>

      <button
        onClick={() => onNavigate('favorites')}
        className="flex items-center gap-1 text-sm text-slate-300 hover:text-white"
      >
        <Heart className="w-4 h-4" />
        Favorites
      </button>

      <button
        onClick={async () => {
          await logout();
          window.location.reload();
        }}
        className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </>
  )}
</div>

 


          {/* Search & Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Search Bar */}
            <div className={`${searchOpen ? 'flex' : 'hidden'} md:flex items-center absolute md:relative left-0 right-0 top-16 md:top-0 bg-slate-900 md:bg-transparent px-4 md:px-0 py-3 md:py-0 border-b md:border-0 border-white/5 z-50`}>
              <div className="relative w-full md:w-64 lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search sermons..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/30 transition-all"
                />
              </div>
            </div>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 py-2 pb-4">
            {/* Main navigation */}
            <div className="mb-2">
              <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Navigation</p>
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      currentView === item.id
                        ? 'text-white bg-white/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>


              {user && (
  <div className="border-t border-white/5 pt-2">
    <button
      onClick={() => {
        onNavigate('favorites');
        setMobileMenuOpen(false);
      }}
      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white"
    >
      <Heart className="w-4 h-4" />
      My Favorites
    </button>

    <button
      onClick={async () => {
        await logout();
        window.location.reload();
      }}
      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400"
    >
      Logout
    </button>
  </div>
)}

{!user && (
  <div className="border-t border-white/5 pt-2">
    <button
      onClick={() => {
        onNavigate('login');
        setMobileMenuOpen(false);
      }}
      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white"
    >
      <User className="w-4 h-4" />
      Login
    </button>

    <button
      onClick={() => {
        onNavigate('register');
        setMobileMenuOpen(false);
      }}
      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-amber-400 hover:text-amber-300"
    >
      <User className="w-4 h-4" />
      Create Account
    </button>
  </div>
)}

            {/* Quick filters */}
            <div className="border-t border-white/5 pt-2">
              <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick Access</p>
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
