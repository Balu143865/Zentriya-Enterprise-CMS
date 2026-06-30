import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Sun, Moon, LogIn, Send, Sparkles, Mail, Globe,
  Home, Info, Cpu, GraduationCap, BookOpen, Image, Users, Briefcase, FileText,
  Phone, ArrowRight, Github, Twitter, Linkedin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../services/db';
import { WebsiteSettings } from '../types';

const iconMap: Record<string, React.ComponentType<any>> = {
  Home,
  Info,
  Cpu,
  GraduationCap,
  BookOpen,
  Image,
  Users,
  Briefcase,
  FileText,
  Mail
};

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
    { name: 'Home', path: '/', icon: 'Home' },
    { name: 'About', path: '/about', icon: 'Info' },
    { name: 'Services', path: '/services', icon: 'Cpu' },
    { name: 'Internships', path: '/internships', icon: 'GraduationCap' },
    { name: 'Courses', path: '/courses', icon: 'BookOpen' },
    { name: 'Gallery', path: '/gallery', icon: 'Image' },
    { name: 'Team', path: '/team', icon: 'Users' },
    { name: 'Careers', path: '/careers', icon: 'Briefcase' },
    { name: 'Blog', path: '/blog', icon: 'FileText' },
    { name: 'Contact', path: '/contact', icon: 'Mail' }
  ];

  const activeLinkStyle = (path: string) => {
    const isActive = location.pathname === path;
    return isActive 
      ? 'text-blue-600 dark:text-blue-400 font-bold tracking-tight' 
      : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200';
  };

  return (
    <>
      {/* Corporate Top Bar */}
      <div id="corporate-top-bar" className="bg-slate-900 text-slate-300 text-[11px] sm:text-xs py-2 border-b border-slate-800 relative z-50">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-8 flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Official Helplines */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span className="text-slate-400 font-medium">Official Helplines:</span>
            <a href="tel:+917989270174" className="hover:text-emerald-400 transition-colors font-semibold">
              +91 7989270174
            </a>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <a href="tel:+919550950705" className="hover:text-emerald-400 transition-colors font-semibold">
              +91 95509 50705
            </a>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <a href="tel:+916301550330" className="hover:text-emerald-400 transition-colors font-semibold">
              +91 6301550330
            </a>
          </div>

          {/* Email & Website */}
          <div className="flex items-center gap-3">
            <a href="mailto:info.zentriya@gmail.com" className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-semibold">
              <Mail size={12} className="text-emerald-500" />
              info.zentriya@gmail.com
            </a>
            <span className="text-slate-700">|</span>
            <a href="https://zentriya.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-semibold">
              <Globe size={12} className="text-emerald-500" />
              zentriya.com
            </a>
          </div>
        </div>
      </div>

      {/* Announcement Bar */}
      {settings?.announcementActive && settings.announcementText && (
        <div id="announcement-bar" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-xs sm:text-sm py-2 text-center font-bold relative z-50">
          <div className="w-full px-4 sm:px-6 md:px-10 xl:px-12 text-center">
            {settings.announcementText}
          </div>
        </div>
      )}

      {/* Main Nav Header */}
      <header 
        id="main-nav-header"
        className={`sticky top-0 z-40 transition-all duration-350 ${
          scrolled 
            ? 'bg-white/95 dark:bg-slate-950/90 border-b border-slate-100 dark:border-slate-900/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-none backdrop-blur-xl py-3' 
            : 'bg-white/80 dark:bg-slate-950/40 border-b border-transparent backdrop-blur-md py-4.5'
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-8 flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <Link id="logo-brand-link" to="/" className="flex items-center gap-3 group shrink-0 select-none">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings?.companyName || 'Zentriya Logo'} 
                className="h-10 w-auto object-contain group-hover:scale-105 group-hover:rotate-[2deg] transition-all duration-300 shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-black text-2xl shrink-0 group-hover:scale-105 group-hover:rotate-[2deg] transition-all duration-300">
                Z
              </div>
            )}
            <div className="flex flex-col shrink-0">
              <span className="font-bold text-base sm:text-lg leading-none tracking-tight text-slate-900 dark:text-white font-display whitespace-nowrap group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                ZENTRIYA
              </span>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold text-blue-600 dark:text-blue-400 mt-0.5 sm:mt-1 whitespace-nowrap group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-300">
                IT Solutions Private Limited
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation Link Cluster with Sliding Glass Active Indicator */}
          <nav id="desktop-nav-cluster" className="hidden xl:flex items-center justify-center xl:gap-0.5 min-[1350px]:gap-1 min-[1450px]:gap-2 2xl:gap-3 bg-transparent p-1 rounded-full border-none backdrop-blur-none">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  id={`nav-${link.name.toLowerCase()}`}
                  key={link.path} 
                  to={link.path} 
                  className={`relative px-1.5 min-[1350px]:px-2.5 min-[1450px]:px-3.5 2xl:px-4 py-1.5 text-[11px] min-[1350px]:text-xs min-[1450px]:text-[13px] 2xl:text-sm whitespace-nowrap rounded-full transition-colors duration-300 font-semibold tracking-tight ${
                    isActive 
                      ? 'text-blue-600 dark:text-blue-400 font-bold' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Controls & Action Call */}
          <div id="header-action-panel" className="flex items-center gap-1.5 sm:gap-2.5 min-[1350px]:gap-3 xl:gap-2 min-[1400px]:gap-3 2xl:gap-4 shrink-0">
            
            {/* Elegant, Explicit sliding Theme Toggle Switch */}
            <div id="theme-toggle-switch" className="relative flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-full border border-slate-200/50 dark:border-slate-700/50 shrink-0 select-none w-[66px] h-[34px] hover:scale-102 transition-transform duration-200">
              <button
                id="theme-toggle-light"
                onClick={() => setDarkMode(false)}
                className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  !darkMode ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Light Mode"
                aria-label="Light Mode"
              >
                <Sun size={14} className="shrink-0" />
              </button>
              
              <button
                id="theme-toggle-dark"
                onClick={() => setDarkMode(true)}
                className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  darkMode ? 'text-amber-400' : 'text-slate-400 hover:text-slate-800'
                }`}
                title="Dark Mode"
                aria-label="Dark Mode"
              >
                <Moon size={14} className="shrink-0" />
              </button>

              <motion.div
                layout
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
                className="absolute inset-y-1 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-200/10 dark:border-slate-700/30"
                style={{
                  width: "26px",
                  left: darkMode ? "34px" : "6px"
                }}
              />
            </div>

            {/* Secondary Portal button styled with brand accents */}
            <Link 
              id="admin-console-shortcut"
              to="/admin/login" 
              className="group/admin px-2 xl:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 rounded-xl text-[11px] xl:text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1 xl:gap-1.5 shrink-0 shadow-md hover:scale-105 active:scale-95 border-none"
              title="Super Admin Dashboard Console"
            >
              <LogIn size={13} className="shrink-0 transition-transform group-hover/admin:translate-x-0.5 duration-200 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline xl:hidden">Admin</span>
              <span className="hidden xl:inline">Admin Portal</span>
            </Link>

            {/* Mobile Nav Menu Toggler */}
            <button 
              id="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 xl:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg shrink-0 transition-all active:scale-90"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>


          </div>
        </div>

        {/* Premium Mobile Navigation Drawer - Slide-in Right with Backdrop Blur & Glassmorphism */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Overlay Backdrop with blur */}
              <motion.div
                key="mobile-nav-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setMobileMenuOpen(false)}
                className="xl:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50"
              />

              {/* Glassmorphism Drawer Panel */}
              <motion.div
                key="mobile-nav-drawer"
                initial={{ x: '100%', opacity: 0.9 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0.9 }}
                transition={{ type: 'spring', damping: 26, stiffness: 200 }}
                className="xl:hidden fixed inset-y-0 right-0 w-[85%] max-w-[380px] h-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-l border-slate-250/50 dark:border-slate-800/50 shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto"
                id="mobile-navigation-drawer"
              >
                <div>
                  {/* Header inside Drawer */}
                  <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg">
                        Z
                      </div>
                      <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white font-display">
                        ZENTRIYA
                      </span>
                    </div>
                    
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:rotate-90 transition-all duration-350"
                      aria-label="Close menu"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Nav Links Scroller with Stagger and Elegant Hover Effects */}
                  <div className="space-y-1.5">
                    {navLinks.map((link, idx) => {
                      const isActive = location.pathname === link.path;
                      const IconComponent = iconMap[link.icon] || Sparkles;
                      
                      return (
                        <motion.div
                          key={link.path}
                          initial={{ opacity: 0, x: 25 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.035, type: 'spring', stiffness: 160 }}
                        >
                          <Link 
                            id={`mob-nav-${link.name.toLowerCase()}`}
                            to={link.path} 
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3.5 py-2.5 px-3.5 rounded-xl text-[13.5px] font-bold tracking-tight transition-all duration-300 group/item active:scale-[0.98] ${
                              isActive 
                                ? 'bg-gradient-to-r from-blue-600/10 to-emerald-500/10 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 pl-3' 
                                : 'text-slate-750 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850/50 hover:pl-5'
                            }`}
                          >
                            <span className={`p-1.5 rounded-lg transition-colors duration-300 ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover/item:bg-blue-500 group-hover/item:text-white'}`}>
                              <IconComponent size={14} />
                            </span>
                            <span className="flex-1">{link.name}</span>
                            <ArrowRight size={13} className={`opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all duration-300 text-blue-600 dark:text-blue-400 ${isActive ? 'opacity-80' : ''}`} />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Actions and Contact Info inside Drawer */}
                <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800/80 space-y-5">
                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Link 
                      id="mob-nav-admin-btn"
                      to="/admin/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs py-2.5 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800/60 active:scale-95 transition-all"
                    >
                      <LogIn size={13} />
                      Admin
                    </Link>
                    <Link 
                      id="mob-nav-contact-btn"
                      to="/contact" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-xs py-2.5 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-blue-500/10"
                    >
                      <Send size={13} />
                      Write Us
                    </Link>
                  </div>

                  {/* Helpline Details */}
                  <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/30 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                    <div className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500">Corporate Helplines</div>
                    <div className="space-y-0.5 text-xs font-semibold text-slate-750 dark:text-slate-300">
                      <a href="tel:+917989270174" className="block hover:text-blue-500 transition-colors">+91 79892 70174</a>
                      <a href="tel:+919550950705" className="block hover:text-blue-500 transition-colors">+91 95509 50705</a>
                    </div>
                  </div>

                  {/* Social links */}
                  <div className="flex items-center justify-center gap-4 text-slate-400 dark:text-slate-500 pb-1">
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">
                      <Linkedin size={15} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">
                      <Twitter size={15} />
                    </a>
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                      <Github size={15} />
                    </a>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
