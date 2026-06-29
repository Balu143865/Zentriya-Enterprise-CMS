import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../services/auth';
import { db } from '../services/db';
import { UserProfile, SystemNotification } from '../types';
import { 
  LayoutDashboard, Settings, FileText, GraduationCap, 
  Layers, Image, Users, MessageSquare, Briefcase, 
  HelpCircle, LogOut, Moon, Sun, Bell, Terminal, Database,
  ArrowLeft, Menu, X, Award, ShieldAlert, Milestone, BookOpen
} from 'lucide-react';
import { useToast } from '../components/Toast';

interface AdminLayoutProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function AdminLayout({ darkMode, setDarkMode }: AdminLayoutProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [showNots, setShowNots] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const profile = auth.getCurrentUser();
    if (!profile) {
      navigate('/admin/login');
      toast('Access Denied: Please authenticate to access the Admin Console.', 'error');
    } else if (profile.role !== 'OWNER') {
      auth.logout();
      navigate('/admin/login');
      toast('Access Denied: Only the company OWNER has console permission clearance.', 'error');
    } else {
      setUser(profile);
      db.getNotifications().then(setNotifications);
    }
  }, [navigate, location.pathname]);

  // Session Timeout after 15 minutes of inactivity (900,000 ms)
  useEffect(() => {
    if (!user) return;

    let timeoutId: any;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        auth.logout();
        toast('Your session was terminated due to 15 minutes of inactivity.', 'warning');
        navigate('/admin/login?timeout=true');
      }, 15 * 60 * 1000); // 15 minutes
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, resetTimer));
    resetTimer();

    return () => {
      events.forEach(evt => window.removeEventListener(evt, resetTimer));
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, navigate]);

  const handleLogout = () => {
    auth.logout();
    toast('Session terminated successfully.', 'info');
    navigate('/admin/login');
  };

  const markRead = async (id: string) => {
    await db.markNotificationRead(id);
    db.getNotifications().then(setNotifications);
  };

  const activeNotsCount = notifications.filter(n => !n.isRead).length;

  // Sidebar modules configuration
  const modules = [
    { name: 'Dashboard Overview', key: 'dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Website Settings', key: 'settings', path: '/admin/manage?tab=settings', icon: Settings },
    { name: 'Hero Slides', key: 'home', path: '/admin/manage?tab=hero', icon: Image },
    { name: 'Why Choose Us', key: 'why_choose_us', path: '/admin/manage?tab=why_choose_us', icon: Award },
    { name: 'Student Journey', key: 'student_journey', path: '/admin/manage?tab=student_journey', icon: Milestone },
    { name: 'Industry Network', key: 'industry_network', path: '/admin/manage?tab=industry_network', icon: Award },
    { name: 'Placement Records', key: 'placements', path: '/admin/manage?tab=placements', icon: GraduationCap },
    { name: 'About Us Section', key: 'about', path: '/admin/manage?tab=about', icon: FileText },
    { name: 'Services Portfolio', key: 'services', path: '/admin/manage?tab=services', icon: Layers },
    { name: 'Internship Programs', key: 'internships', path: '/admin/manage?tab=internships', icon: GraduationCap },
    { name: 'Enterprise Courses', key: 'courses', path: '/admin/manage?tab=courses', icon: GraduationCap },
    { name: 'Media Gallery', key: 'gallery', path: '/admin/manage?tab=gallery', icon: Image },
    { name: 'Blogs & Articles', key: 'blogs', path: '/admin/manage?tab=blogs', icon: FileText },
    { name: 'Tech Articles', key: 'articles', path: '/admin/manage?tab=articles', icon: BookOpen },
    { name: 'Team Management', key: 'team', path: '/admin/manage?tab=team', icon: Users },
    { name: 'Testimonials Feed', key: 'testimonials', path: '/admin/manage?tab=testimonials', icon: MessageSquare },
    { name: 'Careers & Jobs', key: 'careers', path: '/admin/manage?tab=careers', icon: Briefcase },
    { name: 'Applications Box', key: 'applications', path: '/admin/manage?tab=applications', icon: Briefcase },
    { name: 'Contact Inquiries', key: 'contacts', path: '/admin/manage?tab=contacts', icon: MessageSquare },
    { name: 'FAQs Center', key: 'faqs', path: '/admin/manage?tab=faqs', icon: HelpCircle }
  ];

  if (!user) return null;

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        
        {/* Sidebar Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
            <img src="/logo.png" alt="Zentriya Logo" className="w-8 h-8 object-contain" />
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm leading-tight">Admin Console</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Zentriya IT Solutions</span>
            </div>
          </Link>

          <div className="flex items-center gap-1.5">
            <Link 
              to="/" 
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Return to Public Website"
            >
              <ArrowLeft size={14} />
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white transition-colors"
              title="Close Navigation Menu"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Nav Link Cluster (Role Filtered) */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {modules.map((m) => {
            const permitted = auth.hasAccess(user.role, m.key);
            if (!permitted) return null; // RBAC Lockout

            const Icon = m.icon;
            const isActive = location.pathname === m.path || (location.pathname + location.search).includes(m.path);

            return (
              <Link 
                id={`admin-nav-${m.key}`}
                key={m.key}
                to={m.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={16} />
                <span>{m.name}</span>
              </Link>
            );
          })}
        </nav>

      </div>

      {/* User Card & Logout bottom */}
      <div className="p-4 border-t border-slate-800 space-y-4">
        <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-850">
          <img 
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop&q=80'} 
            alt={user.name} 
            className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/20"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <h5 className="text-white font-bold text-xs truncate leading-tight">{user.name}</h5>
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">{user.role}</span>
          </div>
        </div>

        <button 
          onClick={() => {
            setSidebarOpen(false);
            handleLogout();
          }}
          className="w-full bg-slate-800 hover:bg-red-950/40 hover:text-red-400 text-slate-400 p-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all border border-slate-750"
        >
          <LogOut size={14} />
          Terminate Session
        </button>
      </div>
    </div>
  );

  return (
    <div id="admin-shell-root" className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">
      
      {/* 1. LEFT SIDEBAR PANEL */}
      {/* Desktop View: Persistent Static Sidebar */}
      <aside 
        id="admin-sidebar-desktop" 
        className="hidden lg:flex w-72 bg-slate-900 text-slate-300 flex-col justify-between border-r border-slate-800 shrink-0 h-screen sticky top-0"
      >
        {sidebarContent}
      </aside>

      {/* Mobile View: Animated Sidebar and Backdrop with Framer Motion */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop for Mobile Drawer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-35 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              id="admin-sidebar-backdrop"
            />

            {/* Slide-out Panel */}
            <motion.aside 
              id="admin-sidebar-mobile" 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 2. MAIN VIEW STAGE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Controls bar */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800/80 px-6 py-4.5 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800 mr-1"
              title="Open Navigation Menu"
            >
              <Menu size={18} />
            </button>
            <span className="text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wide">
              <Terminal size={12} />
              Session Status: Online
            </span>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Dark Mode toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Notification drop */}
            <div className="relative">
              <button 
                onClick={() => setShowNots(!showNots)}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 relative"
              >
                <Bell size={17} />
                {activeNotsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>

              {showNots && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
                    <span>System Alerts</span>
                    <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full">{activeNotsCount} New</span>
                  </h4>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => markRead(n.id)}
                          className={`p-2.5 rounded-lg text-xs leading-relaxed cursor-pointer transition-colors ${
                            n.isRead ? 'bg-slate-50 dark:bg-slate-950 text-slate-400' : 'bg-emerald-50/50 dark:bg-emerald-950/20 text-slate-800 dark:text-slate-200 font-medium border-l-2 border-emerald-500'
                          }`}
                        >
                          <div className="font-bold text-[10px] uppercase tracking-wider">{n.title}</div>
                          <p className="mt-0.5">{n.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-slate-400 text-center py-4">No new alerts.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Active Role tag */}
            <span className="text-xs font-bold bg-slate-900 text-white dark:bg-slate-800 px-3.5 py-1.5 rounded-xl uppercase tracking-wider">
              {user.role} Control
            </span>

          </div>
        </header>

        {/* Layout Output Panel */}
        <main className="p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
