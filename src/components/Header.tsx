import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, LogIn, Send, PhoneCall, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../services/db';
import { WebsiteSettings } from '../types';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Header({ darkMode, setDarkMode }: HeaderProps) {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    db.getSettings().then(setSettings);

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  // Force close mobile menu on page shift
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Internships', path: '/internships' },
    { name: 'Courses', path: '/courses' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Team', path: '/team' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  const activeLinkStyle = (path: string) => {
    const isActive = location.pathname === path;
    return isActive 
      ? 'text-blue-600 dark:text-blue-400 font-bold tracking-tight' 
      : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200';
  };

  return (
    <>
      {/* Announcement Bar */}
      {settings?.announcementActive && settings.announcementText && (
        <div id="announcement-bar" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-xs sm:text-sm py-2 px-4 text-center font-bold relative z-50">
          {settings.announcementText}
        </div>
      )}

      {/* Main Nav Header */}
      <header 
        id="main-nav-header"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/90 dark:bg-slate-900/90 shadow-lg shadow-slate-100/10 dark:shadow-none border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl py-3' 
            : 'bg-white/80 dark:bg-slate-950/80 border-b border-transparent backdrop-blur-md py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link id="logo-brand-link" to="/" className="flex items-center gap-3 group">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings?.companyName || 'Zentriya Logo'} 
                className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-black text-2xl">
                Z
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg leading-none tracking-tight text-slate-900 dark:text-white font-display">
                ZENTRIYA
              </span>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold text-blue-600 dark:text-blue-400 mt-0.5 sm:mt-1">
                IT Solutions Private Limited
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Link Cluster */}
          <nav id="desktop-nav-cluster" className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link 
                id={`nav-${link.name.toLowerCase()}`}
                key={link.path} 
                to={link.path} 
                className={`text-sm ${activeLinkStyle(link.path)}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Controls & Action Call */}
          <div id="header-action-panel" className="flex items-center gap-2 sm:gap-4">
            
            {/* Dark Mode toggle */}
            <button 
              id="theme-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Admin Console shortcut link */}
            <Link 
              id="admin-console-shortcut"
              to="/admin/login" 
              className="px-3 py-2 sm:px-5 sm:py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-all duration-200 flex items-center gap-1.5 shrink-0"
              title="Super Admin Dashboard Console"
            >
              <LogIn size={13} />
              <span className="hidden sm:inline">Admin Portal</span>
            </Link>

            {/* Mobile Nav Menu Toggler */}
            <button 
              id="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Quick Contact Primary Button */}
            <Link 
              id="header-cta-btn"
              to="/contact" 
              className="hidden xl:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-sm px-6 py-2.5 rounded-full font-bold shadow-lg shadow-blue-500/15 hover:scale-105 hover:brightness-110 transition-all duration-300"
            >
              <PhoneCall size={14} />
              Connect Now
            </Link>
          </div>
        </div>

        {/* Mobile Menu Dropdown Panel with Framer Motion (Slide-down from header) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Overlay Backdrop */}
              <motion.div
                key="mobile-nav-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-30"
              />

              {/* Dropdown Menu Panel (Absolute to Header container) */}
              <motion.div
                key="mobile-nav-dropdown"
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="lg:hidden absolute top-full left-0 right-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800/80 shadow-2xl z-40 p-5 flex flex-col rounded-b-2xl max-h-[80vh] overflow-y-auto"
                id="mobile-navigation-dropdown"
              >
                {/* Header inside Menu */}
                <div className="flex items-center justify-between mb-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-blue-600 dark:text-blue-400 w-4 h-4 animate-pulse" />
                    <span className="font-bold text-xs tracking-wider text-slate-500 dark:text-slate-400 uppercase font-mono">
                      Navigation Menu
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Nav Links Scroller */}
                <div className="space-y-1.5 py-1 custom-scrollbar">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02, duration: 0.2 }}
                    >
                      <Link 
                        id={`mob-nav-${link.name.toLowerCase()}`}
                        to={link.path} 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block py-2.5 px-4 rounded-xl text-sm font-bold tracking-tight transition-all duration-200 ${
                          location.pathname === link.path 
                            ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600' 
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom Actions Row */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-3 shrink-0">
                  <Link 
                    id="mob-nav-admin-btn"
                    to="/admin/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs py-3 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <LogIn size={14} />
                    Admin Console
                  </Link>
                  <Link 
                    id="mob-nav-contact-btn"
                    to="/contact" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-xs py-3 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-blue-500/10"
                  >
                    <Send size={14} />
                    Write Us
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
