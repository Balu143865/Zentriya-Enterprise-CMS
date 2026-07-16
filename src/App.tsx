import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Programs from './pages/Programs';
import Gallery from './pages/Gallery';
import Team from './pages/Team';
import Careers from './pages/Careers';
import Blog from './pages/Blog';
import Contact from './pages/Contact';

// Admin modules
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminOverview from './admin/AdminOverview';
import AdminManage from './admin/AdminManage';

import { ToastProvider } from './components/Toast';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AestheticControls from './components/AestheticControls';
import FloatingChatBot from './components/FloatingChatBot';

// Scroll Restoration Utility to enhance enterprise quality user experience
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Wrapper to isolate Header & Footer on Admin Pages
function PublicLayout({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (dark: boolean) => void }) {
  return (
    <div className="flex flex-col min-h-screen text-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 w-full overflow-x-hidden">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-1">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/internships" element={<Navigate to="/programs" replace />} />
          <Route path="/courses" element={<Navigate to="/programs" replace />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/team" element={<Team />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <FloatingChatBot />
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Sync theme changes from the Aesthetic controls instantly
  useEffect(() => {
    const handleThemeChange = () => {
      const saved = localStorage.getItem('theme');
      setDarkMode(saved === 'dark');
    };
    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  return (
    <ToastProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            
            {/* Admin Auth Route (Fully isolated design canvas) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Nested Admin Console Routes */}
            <Route path="/admin" element={<AdminLayout darkMode={darkMode} setDarkMode={setDarkMode} />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminOverview />} />
              <Route path="manage" element={<AdminManage />} />
            </Route>

            {/* Standard Public website tracks */}
            <Route path="/*" element={<PublicLayout darkMode={darkMode} setDarkMode={setDarkMode} />} />

          </Routes>
        </BrowserRouter>
        {/* Global Aesthetics Floating Controller */}
        <AestheticControls />
      </AdminAuthProvider>
    </ToastProvider>
  );
}
