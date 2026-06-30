import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { ProgramItem } from '../types';
import { PremiumProgramCard } from '../components/PremiumProgramCard';
import { AnimatedHeader, AnimatedCardContainer, AnimatedCard } from '../components/AnimatedTransitions';

// Lightweight interactive particle background
export const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {[...Array(25)].map((_, i) => {
        const size = Math.random() * 3 + 2;
        const delay = Math.random() * 5;
        const duration = Math.random() * 15 + 15;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        return (
          <div
            key={i}
            className="absolute rounded-full bg-blue-500/10 dark:bg-blue-400/10 blur-[1px]"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `${top}%`,
              animation: `float-particle ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes float-particle {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-120px) translateX(40px) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default function Programs() {
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedSyllabus, setExpandedSyllabus] = useState<string | null>(null);

  useEffect(() => {
    db.getPrograms().then((data) => {
      setPrograms(data.filter(p => p.is_active));
      setLoading(false);
    });
  }, []);

  const categories = ['All', ...Array.from(new Set(programs.map(p => p.category)))];

  const filteredPrograms = activeCategory === 'All'
    ? programs
    : programs.filter(p => p.category === activeCategory);

  const toggleSyllabus = (id: string) => {
    setExpandedSyllabus(prev => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/10 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div id="programs-page-root" className="bg-[#040812] min-h-screen pb-24 text-slate-100 relative overflow-hidden">
      
      {/* Mesh/Grid Background lines and radial light vectors */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none select-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12)_0%,rgba(16,185,129,0.04)_50%,transparent_100%)] pointer-events-none select-none z-0" />
      
      {/* Background ambient glow points */}
      <div className="absolute top-[30%] left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-[50%] right-1/4 w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[70%] left-1/3 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[110px] pointer-events-none z-0" />

      {/* Floating stars/particles system */}
      <FloatingParticles />

      {/* Hero Header Block */}
      <AnimatedHeader className="py-20 sm:py-24 text-center relative z-10 max-w-5xl mx-auto px-4 space-y-6">
        
        {/* SMALL LABEL: OUR PROGRAMS with tech dots and accent lines */}
        <div className="flex items-center justify-center gap-4 text-emerald-400 font-mono text-xs font-black tracking-[0.25em] uppercase select-none">
          <span className="flex items-center gap-1.5 opacity-80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-emerald-400" />
          </span>
          OUR PROGRAMS
          <span className="flex items-center gap-1.5 opacity-80">
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-emerald-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </span>
        </div>

        {/* MAIN HEADING: Explore Our Premium Programs with custom gradient highlight */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-white font-display">
          Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.2)]">Premium</span> Programs
        </h1>

        {/* SUBTITLE */}
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
          Industry-relevant training programs designed to transform your career with practical experience.
        </p>

        {/* Minimal elegant horizontal green accent divider */}
        <div className="flex justify-center items-center gap-2 pt-2">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-emerald-500/50" />
          <div className="w-2 h-2 rounded-full border border-emerald-500/50" />
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-emerald-500/50" />
        </div>
      </AnimatedHeader>

      {/* Main Grid Viewport */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Category Filters */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-900/40 p-2 rounded-full border border-slate-800/50 backdrop-blur-md max-w-lg mx-auto">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat 
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-lg shadow-blue-500/15 scale-102 font-extrabold' 
                    : 'text-slate-400 hover:text-white transition-colors duration-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Programs dynamic cards grid layout */}
        <AnimatedCardContainer className="flex flex-wrap justify-center gap-5 max-w-5xl mx-auto pt-6">
          {filteredPrograms.map((program) => (
            <AnimatedCard 
              key={program.id}
              className="w-full md:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] flex flex-col"
            >
              <PremiumProgramCard 
                program={program}
                expandedSyllabus={expandedSyllabus}
                toggleSyllabus={toggleSyllabus}
              />
            </AnimatedCard>
          ))}
        </AnimatedCardContainer>
      </div>
    </div>
  );
}
