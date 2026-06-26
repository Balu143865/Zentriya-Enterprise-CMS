import { useState, useEffect } from 'react';
import { db } from '../services/db';
import { AboutSection } from '../types';
import { motion } from 'motion/react';
import { ShieldCheck, GraduationCap, Award, BookOpen } from 'lucide-react';

export default function About() {
  const [about, setAbout] = useState<AboutSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getAbout().then((data) => {
      setAbout(data);
      setLoading(false);
    });
  }, []);

  if (loading || !about) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center" id="about-loading-container">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/10 border-t-emerald-600 animate-spin" />
      </div>
    );
  }

  // Split description by newlines to keep paragraph formatting and spacing exactly
  const paragraphs = (about.description || '').split('\n\n').filter(p => p.trim() !== '');

  return (
    <div id="about-page-root" className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24 overflow-hidden">
      
      {/* Decorative background glow elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/2 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/2 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Banner Section */}
      <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-20 sm:py-24 text-center border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent)]" />
        <div className="max-w-5xl mx-auto px-4 relative z-10 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-emerald-400 font-bold tracking-widest text-xs sm:text-sm uppercase block font-mono"
          >
            Empowering Employability & Innovation
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-white font-display"
          >
            About Our Organization
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-emerald-500 to-blue-600 mx-auto rounded-full" 
          />
        </div>
      </div>

      {/* Main Brochure Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* Visual Presentation (Left Side) */}
          <div className="lg:col-span-5 relative" id="about-visual-pane">
            <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-70" />
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-3 sm:p-4 rounded-3xl shadow-2xl overflow-hidden group">
              <img 
                src={about.image} 
                alt="Zentriya IT Solutions Corporate Brochure View" 
                referrerPolicy="no-referrer"
                className="w-full h-[320px] sm:h-[420px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Subtle Overlay Badge */}
              <div className="absolute bottom-8 left-8 bg-slate-950/80 backdrop-blur-md border border-slate-700/50 text-white p-4 rounded-2xl shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-wider text-emerald-400 font-bold uppercase">ISO Certified</p>
                  <p className="text-xs font-bold">Academic-Industry Alliance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Official Content Presentation (Right Side) */}
          <div className="lg:col-span-7 space-y-8" id="about-content-pane">
            
            {/* Brochure Header with Decorative Green Divider Lines */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="h-[2px] w-12 bg-emerald-500 dark:bg-emerald-400 rounded-full" />
                <h2 className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-widest font-display uppercase">
                  {about.title}
                </h2>
                <span className="h-[2px] w-12 bg-emerald-500 dark:bg-emerald-400 rounded-full" />
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug font-display">
                Transforming Education <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">Into Employability</span>
              </h3>
            </div>

            {/* Official Brochure Paragraphs */}
            <div className="space-y-6 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
              {paragraphs.map((p, idx) => (
                <p key={idx} className="whitespace-pre-line text-justify">
                  {p}
                </p>
              ))}
            </div>

            {/* Core Competencies Ribbon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-400/5 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">IT & Non-IT Training</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Future-focused industry-driven skill sets.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-400/5 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">Real-time Internships</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Practical exposure to global work standards.</p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

    </div>
  );
}
