import React, { useState, useEffect, useRef } from 'react';
import { db } from '../services/db';
import { CourseItem } from '../types';
import { BookOpen, Clock, Check, Award, ArrowRight, Users, Cloud, Brain, Briefcase, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedHeader } from '../components/AnimatedTransitions';

// Container variants for staggered entrance
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 15
    }
  }
};

// Beautiful lightweight interactive particle background
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

export interface PremiumCourseCardProps {
  course: CourseItem;
  expandedSyllabus: string | null;
  toggleSyllabus: (id: string) => void;
  key?: string | number;
  className?: string;
}

export function PremiumCourseCard({ course, expandedSyllabus, toggleSyllabus, className = "" }: PremiumCourseCardProps) {
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

  // Select dynamic themes based on course ID or ordering
  const getCardTheme = () => {
    const id = course.id;
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
        shadowGlow: 'hover:shadow-[0_0_35px_rgba(168,85,247,0.22)]',
        chipBorder: 'border-purple-500/20 bg-purple-500/5 text-purple-300'
      };
    }
  };

  const theme = getCardTheme();

  const getTechIcon = () => {
    const text = (course.category + " " + course.title).toLowerCase();
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
    if (course.bannerUrl) return course.bannerUrl;
    const title = course.title.toLowerCase();
    if (title.includes('web') || title.includes('react') || title.includes('frontend')) {
      return 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=500&fit=crop&q=80';
    }
    if (title.includes('cloud') || title.includes('devops')) {
      return 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800&h=500&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&h=500&fit=crop&q=80';
  };

  const isSyllabusExpanded = expandedSyllabus === course.id;

  return (
    <motion.div
      variants={cardVariants}
      className={`h-full flex flex-col ${className}`}
    >
      <div
        id={`course-item-card-${course.id}`}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`group relative h-full flex flex-col bg-[#0B1220] border ${theme.border} rounded-2xl overflow-hidden transition-all duration-300 shadow-xl ${theme.shadowGlow}`}
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

        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Image Section - reduced height from h-52 to h-40 */}
            <div className="relative h-40 w-full overflow-hidden rounded-t-2xl bg-slate-950">
              <img
                src={getBannerImage()}
                alt={course.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Cover dark overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/20 to-transparent z-10" />

              {/* Floating Badge (Pill Style with float animation & glass effect) */}
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute top-3 right-3 z-20 bg-slate-900/80 backdrop-blur-md text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-slate-700/40 text-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center gap-1.5"
              >
                <span>{course.mode}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${theme.badgeGlow} animate-pulse`} />
              </motion.div>

              {/* Floating Circular Icon overlapping the border - reduced from w-14 h-14 to w-11 h-11 */}
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 w-11 h-11 rounded-full flex items-center justify-center bg-slate-950/90 border border-slate-800 shadow-[0_0_15px_rgba(0,0,0,0.8)] backdrop-blur-md hover:scale-110 transition-transform duration-300"
              >
                {/* Visual pulse glow */}
                <span className={`absolute inset-0 rounded-full bg-gradient-to-tr ${theme.gradient} opacity-20 blur-md`} />
                <span className="absolute inset-0 rounded-full border border-current opacity-30 animate-ping" style={{ animationDuration: '3s', color: course.id.includes('1') ? '#34d399' : course.id.includes('2') ? '#3b82f6' : '#a855f7' }} />
                <div className="relative z-10 flex items-center justify-center scale-90">
                  {getTechIcon()}
                </div>
              </motion.div>
            </div>

            {/* Card Body Content - reduced padding and spacing */}
            <div className="p-5 pt-8 space-y-3">
              {/* Duration and category labels */}
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                <span className={`${theme.text} font-black`}>{course.category}</span>
                <span className="flex items-center gap-1">
                  <Clock size={11} className={theme.text} />
                  Duration: <span className="text-white font-extrabold">{course.duration}</span>
                </span>
              </div>

              {/* Title - reduced from text-lg sm:text-xl to text-[15px] sm:text-[17px] */}
              <h3 className="font-extrabold text-white text-[15px] sm:text-[17px] tracking-tight leading-snug group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">
                {course.title}
              </h3>

              {/* Short Description - changed line-clamp-3 to line-clamp-2 */}
              <p className="text-slate-400 text-xs sm:text-[13px] leading-relaxed font-light line-clamp-2">
                {course.description}
              </p>

              {/* Dynamic Feature Chips - compact padding */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${theme.chipBorder} text-[9.5px] font-bold tracking-tight transition-all duration-300 hover:brightness-110`}>
                  <Briefcase size={10} className={theme.text} />
                  <span>Live Projects</span>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${theme.chipBorder} text-[9.5px] font-bold tracking-tight transition-all duration-300 hover:brightness-110`}>
                  <Users size={10} className={theme.text} />
                  <span>Mentor Support</span>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${theme.chipBorder} text-[9.5px] font-bold tracking-tight transition-all duration-300 hover:brightness-110`}>
                  <Award size={10} className={theme.text} />
                  <span>Certificate</span>
                </div>
              </div>

              {/* Elegant expandable syllabus modules */}
              {course.syllabus && course.syllabus.length > 0 && (
                <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-[#0a0f1b]/50 mt-1.5">
                  <button 
                    onClick={() => toggleSyllabus(course.id)}
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
                          {course.syllabus.map((syl, idx) => (
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

          {/* Enroll CTA - reduced vertical padding */}
          <div className="p-5 pt-0 mt-auto">
            <Link 
              to="/contact"
              className={`group/cta relative overflow-hidden bg-gradient-to-r ${theme.gradient} text-white text-[11px] font-black py-2.5 rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg ${theme.shadowGlow} hover:-translate-y-1`}
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300" />
              <span>Enroll Now</span>
              <ArrowRight size={12} className="transform translate-x-0 group-hover/cta:translate-x-1 transition-transform duration-300 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Courses() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedSyllabus, setExpandedSyllabus] = useState<string | null>(null);

  useEffect(() => {
    db.getCourses().then((data) => {
      setCourses(data.filter(c => c.isActive));
      setLoading(false);
    });
  }, []);

  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = activeCategory === 'All'
    ? courses
    : courses.filter(c => c.category === activeCategory);

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
    <div id="courses-page-root" className="bg-[#040812] min-h-screen pb-24 text-slate-100 relative overflow-hidden">
      
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

        {/* MAIN HEADING: Explore Our Premium Courses with custom gradient highlight */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-white font-display">
          Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.2)]">Premium</span> Courses
        </h1>

        {/* SUBTITLE */}
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
          Industry-relevant training programs designed to transform your career.
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
                className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all ${
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

        {/* Courses Cards Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-5 pt-6 max-w-5xl mx-auto"
        >
          {filteredCourses.map((course) => (
            <PremiumCourseCard 
              key={course.id}
              course={course}
              expandedSyllabus={expandedSyllabus}
              toggleSyllabus={toggleSyllabus}
              className="w-full md:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
            />
          ))}
        </motion.div>

        {/* BOTTOM CTA: Centered premium button with glowing border and mouse parallax dotted lines */}
        <div className="relative flex flex-col sm:flex-row justify-center items-center py-16 gap-6 select-none">
          
          {/* Left dotted curve pointing to the CTA */}
          <div className="absolute right-[56%] bottom-[45%] w-64 h-24 pointer-events-none hidden lg:block opacity-65">
            <svg className="w-full h-full text-emerald-500/30" viewBox="0 0 200 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M 10 10 Q 90 75 185 30" strokeDasharray="5 7" />
              <polygon points="185,30 173,28 179,38" fill="currentColor" />
            </svg>
          </div>

          {/* View All Courses Button with glow effect */}
          <Link
            to="/contact"
            className="relative px-8 py-4.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 text-white font-extrabold text-sm sm:text-base tracking-wider shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 group z-10"
          >
            <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="flex items-center gap-2.5">
              View All Courses <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Link>

          {/* Right dotted curve pointing to the CTA */}
          <div className="absolute left-[56%] bottom-[45%] w-64 h-24 pointer-events-none hidden lg:block opacity-65">
            <svg className="w-full h-full text-blue-500/30" viewBox="0 0 200 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M 190 10 Q 110 75 15 30" strokeDasharray="5 7" />
              <polygon points="15,30 27,38 21,28" fill="currentColor" />
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}
