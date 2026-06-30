import React, { useState, useRef } from 'react';
import { ProgramItem } from '../types';
import { BookOpen, Clock, Award, ArrowRight, Users, Cloud, Brain, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export interface PremiumProgramCardProps {
  program: ProgramItem;
  expandedSyllabus: string | null;
  toggleSyllabus: (id: string) => void;
  className?: string;
}

export function PremiumProgramCard({ program, expandedSyllabus, toggleSyllabus, className = "" }: PremiumProgramCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Center offsets
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Subtle tilt for enterprise parallax look
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.setProperty('--rotate-x', `${rotateX}deg`);
    cardRef.current.style.setProperty('--rotate-y', `${rotateY}deg`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--rotate-x', '0deg');
      cardRef.current.style.setProperty('--rotate-y', '0deg');
    }
  };

  // Select dynamic themes based on program ID or ordering
  const getCardTheme = () => {
    const id = program.id;
    if (id.includes('1')) {
      return {
        color: 'emerald',
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20 group-hover:border-emerald-500/60',
        glow: 'rgba(16, 185, 129, 0.15)',
        badgeGlow: 'bg-emerald-400',
        gradient: 'from-emerald-500 via-emerald-600 to-teal-600',
        shadowGlow: 'hover:shadow-[0_0_35px_rgba(16,185,129,0.22)]',
        chipBorder: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300'
      };
    } else if (id.includes('2')) {
      return {
        color: 'blue',
        text: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20 group-hover:border-blue-500/60',
        glow: 'rgba(59, 130, 246, 0.15)',
        badgeGlow: 'bg-blue-400',
        gradient: 'from-blue-500 via-blue-600 to-indigo-600',
        shadowGlow: 'hover:shadow-[0_0_35px_rgba(59,130,246,0.22)]',
        chipBorder: 'border-blue-500/20 bg-blue-500/5 text-blue-300'
      };
    } else {
      return {
        color: 'purple',
        text: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20 group-hover:border-purple-500/60',
        glow: 'rgba(168, 85, 247, 0.15)',
        badgeGlow: 'bg-purple-400',
        gradient: 'from-purple-500 via-purple-600 to-fuchsia-600',
        shadowGlow: 'hover:shadow-[0_0_35px_rgba(168, 85, 247, 0.22)]',
        chipBorder: 'border-purple-500/20 bg-purple-500/5 text-purple-300'
      };
    }
  };

  const theme = getCardTheme();

  const getTechIcon = () => {
    const text = (program.category + " " + program.title).toLowerCase();
    if (text.includes('code') || text.includes('web') || text.includes('development') || text.includes('frontend') || text.includes('react') || text.includes('programming')) {
      return (
        <span className="text-emerald-400 font-mono font-black text-lg select-none">&lt;/&gt;</span>
      );
    }
    if (text.includes('cloud') || text.includes('devops') || text.includes('aws') || text.includes('azure') || text.includes('docker') || text.includes('kubernetes')) {
      return <Cloud className="text-blue-400" size={22} />;
    }
    if (text.includes('data') || text.includes('science') || text.includes('ai') || text.includes('machine') || text.includes('ml') || text.includes('brain') || text.includes('intelligence')) {
      return <Brain className="text-purple-400" size={22} />;
    }
    return <Cloud className="text-blue-400" size={22} />;
  };

  const getBannerImage = () => {
    if (program.cover_image) return program.cover_image;
    const title = program.title.toLowerCase();
    if (title.includes('web') || title.includes('react') || title.includes('frontend')) {
      return 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=500&fit=crop&q=80';
    }
    if (title.includes('cloud') || title.includes('devops')) {
      return 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800&h=500&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&h=500&fit=crop&q=80';
  };

  const isSyllabusExpanded = expandedSyllabus === program.id;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative h-full flex flex-col bg-[#0B1220] border ${theme.border} rounded-2xl overflow-hidden transition-all duration-300 shadow-xl ${theme.shadowGlow} ${className}`}
      style={{
        transform: isHovered
          ? 'perspective(1000px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg)) translateY(-6px)'
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'transform 0.1s ease-out, border-color 0.3s ease' : 'transform 0.5s ease, border-color 0.5s ease'
      }}
    >
      {/* Glowing spotlight effect from cursor */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
        style={{
          background: `radial-gradient(280px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${theme.glow} 0%, transparent 100%)`
        }}
      />

      <div className="flex flex-col h-full">
        <div>
          {/* Image Section */}
          <div className="relative h-40 w-full overflow-hidden rounded-t-2xl bg-slate-950">
            <img
              src={getBannerImage()}
              alt={program.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700 select-none pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent opacity-95 z-10" />

            {/* Float badge Mode */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute top-3 right-3 z-20 bg-slate-900/80 backdrop-blur-md text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-slate-700/40 text-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center gap-1.5"
            >
              <span>{program.mode}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${theme.badgeGlow} animate-pulse`} />
            </motion.div>

            {/* Floating Circular Icon overlapping the border */}
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 w-11 h-11 rounded-full flex items-center justify-center bg-slate-950/90 border border-slate-800 shadow-[0_0_15px_rgba(0,0,0,0.8)] backdrop-blur-md hover:scale-110 transition-transform duration-300"
            >
              <span className={`absolute inset-0 rounded-full bg-gradient-to-tr ${theme.gradient} opacity-20 blur-md`} />
              <div className="relative z-10 flex items-center justify-center scale-90">
                {getTechIcon()}
              </div>
            </motion.div>
          </div>

          {/* Card Body Content */}
          <div className="p-5 pt-8 space-y-3">
            {/* Duration and category labels */}
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
              <span className={`${theme.text} font-black`}>{program.category}</span>
              <span className="flex items-center gap-1">
                <Clock size={11} className={theme.text} />
                Duration: <span className="text-white font-extrabold">{program.duration}</span>
              </span>
            </div>

            {/* Title */}
            <h3 className="font-extrabold text-white text-[15px] sm:text-[17px] tracking-tight leading-snug group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">
              {program.title}
            </h3>

            {/* Short Description */}
            <p className="text-slate-400 text-xs sm:text-[13px] leading-relaxed font-light line-clamp-2">
              {program.description}
            </p>

            {/* Dynamic Feature Chips (Badges) */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
              {(program.badges || ['Live Projects', 'Mentor Support', 'Certificate']).map((badge, idx) => {
                let IconComponent = Briefcase;
                if (badge.toLowerCase().includes('mentor')) IconComponent = Users;
                if (badge.toLowerCase().includes('cert')) IconComponent = Award;

                return (
                  <div key={idx} className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${theme.chipBorder} text-[9.5px] font-bold tracking-tight transition-all duration-300 hover:brightness-110`}>
                    <IconComponent size={10} className={theme.text} />
                    <span>{badge}</span>
                  </div>
                );
              })}
            </div>

            {/* Elegant expandable syllabus modules */}
            {program.syllabus && program.syllabus.length > 0 && (
              <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-[#0a0f1b]/50 mt-1.5">
                <button 
                  onClick={() => toggleSyllabus(program.id)}
                  className="w-full px-3 py-2 flex items-center justify-between text-[11px] font-bold text-slate-300 hover:bg-slate-800/30 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={12} className={theme.text} />
                    Syllabus Curriculum
                  </span>
                  {isSyllabusExpanded ? <ChevronUp size={11} className="text-slate-400" /> : <ChevronDown size={11} className="text-slate-400" />}
                </button>

                <AnimatePresence initial={false}>
                  {isSyllabusExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-3 pb-3 pt-1 space-y-1.5 border-t border-slate-800/60 divide-y divide-slate-800/30">
                        {program.syllabus.map((syl, idx) => (
                          <div key={idx} className="text-[10.5px] text-slate-400 py-1.5 leading-relaxed font-medium">
                            {syl}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Enroll CTA */}
        <div className="p-5 pt-0 mt-auto">
          <Link 
            to="/contact"
            className={`group/cta relative overflow-hidden bg-gradient-to-r ${theme.gradient} text-white text-[11px] font-black py-2.5 rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg ${theme.shadowGlow} hover:-translate-y-1 w-full`}
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300" />
            <span>Enroll Now</span>
            <ArrowRight size={12} className="transform translate-x-0 group-hover/cta:translate-x-1 transition-transform duration-300 shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
