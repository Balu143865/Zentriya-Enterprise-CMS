import React, { useState, useEffect, useRef } from 'react';
import { db } from '../services/db';
import { InternshipProgram } from '../types';
import { BookOpen, Clock, Check, Award, ArrowRight, Users, Cloud, Brain, Briefcase, ChevronDown, ChevronUp, ShieldCheck, Terminal, FileText, Send, X, Laptop } from 'lucide-react';
import { useToast } from '../components/Toast';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

// Container variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
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
const FloatingParticles = () => {
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

interface PremiumInternshipCardProps {
  intern: InternshipProgram;
  expandedFeatures: string | null;
  toggleFeatures: (id: string) => void;
  openApplyModel: (intern: InternshipProgram) => void;
  key?: string | number;
}

function PremiumInternshipCard({ intern, expandedFeatures, toggleFeatures, openApplyModel }: PremiumInternshipCardProps) {
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

  // Select dynamic themes based on internship ID or ordering
  const getCardTheme = () => {
    const id = intern.id;
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
    const text = (intern.title + " " + intern.technology).toLowerCase();
    if (text.includes('code') || text.includes('web') || text.includes('development') || text.includes('frontend') || text.includes('react') || text.includes('mern')) {
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

  const getCategory = () => {
    const text = (intern.title + ' ' + intern.technology).toLowerCase();
    if (text.includes('cloud') || text.includes('devops') || text.includes('aws')) {
      return 'Cloud & DevOps';
    }
    if (text.includes('data') || text.includes('ai') || text.includes('machine') || text.includes('python')) {
      return 'AI & Data Science';
    }
    return 'Development';
  };

  const isFeaturesExpanded = expandedFeatures === intern.id;

  return (
    <motion.div
      variants={cardVariants}
      className="h-full flex flex-col"
    >
      <div
        id={`internship-item-card-${intern.id}`}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`group relative h-full flex flex-col bg-[#0B1220] border ${theme.border} rounded-[24px] overflow-hidden transition-all duration-300 shadow-2xl ${theme.shadowGlow}`}
        style={{
          transform: isHovered
            ? 'perspective(1000px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg)) translateY(-8px)'
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
          transition: isHovered ? 'transform 0.1s ease-out, border-color 0.3s ease' : 'transform 0.5s ease, border-color 0.5s ease'
        }}
      >
        {/* Glowing spotlight effect from cursor */}
        <div
          className="absolute inset-0 rounded-[24px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
          style={{
            background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${theme.glow} 0%, transparent 100%)`
          }}
        />

        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Image Section */}
            <div className="relative h-52 w-full overflow-hidden rounded-t-[23px] bg-slate-950">
              <img
                src={intern.bannerUrl}
                alt={intern.title}
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
                className="absolute top-4 right-4 z-20 bg-slate-900/80 backdrop-blur-md text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest border border-slate-700/40 text-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center gap-1.5"
              >
                <span>{intern.mode}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${theme.badgeGlow} animate-pulse`} />
              </motion.div>

              {/* Floating Circular Icon overlapping the border */}
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 w-14 h-14 rounded-full flex items-center justify-center bg-slate-950/90 border border-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md hover:scale-110 transition-transform duration-300"
              >
                {/* Visual pulse glow */}
                <span className={`absolute inset-0 rounded-full bg-gradient-to-tr ${theme.gradient} opacity-20 blur-md`} />
                <span className="absolute inset-0 rounded-full border border-current opacity-30 animate-ping" style={{ animationDuration: '3s', color: intern.id.includes('1') ? '#34d399' : intern.id.includes('2') ? '#3b82f6' : '#a855f7' }} />
                <div className="relative z-10 flex items-center justify-center">
                  {getTechIcon()}
                </div>
              </motion.div>
            </div>

            {/* Card Body Content */}
            <div className="p-6 pt-10 space-y-4">
              {/* Duration and category labels */}
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-400 font-mono">
                <span className={`${theme.text} font-black`}>{getCategory()}</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className={theme.text} />
                  Duration: <span className="text-white font-extrabold">{intern.duration}</span>
                </span>
              </div>

              {/* Title */}
              <h3 className="font-extrabold text-white text-lg sm:text-xl tracking-tight leading-snug group-hover:text-blue-400 transition-colors duration-300">
                {intern.title}
              </h3>

              {/* Technology details */}
              <div className="flex gap-1.5 items-start bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <Terminal className={`${theme.text} shrink-0 mt-0.5`} size={13} />
                <div className="text-[10px] text-slate-400 font-mono leading-relaxed">
                  <span className="font-extrabold text-slate-300">STACK:</span> {intern.technology}
                </div>
              </div>

              {/* Short Description */}
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light line-clamp-3">
                {intern.description}
              </p>

              {/* Dynamic Feature Chips (Exactly 3) */}
              <div className="flex flex-wrap items-center gap-2 pt-2.5">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${theme.chipBorder} text-[10.5px] font-bold tracking-tight transition-all duration-300 hover:brightness-110`}>
                  <Briefcase size={12} className={theme.text} />
                  <span>Live Projects</span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${theme.chipBorder} text-[10.5px] font-bold tracking-tight transition-all duration-300 hover:brightness-110`}>
                  <Users size={12} className={theme.text} />
                  <span>Mentor Support</span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${theme.chipBorder} text-[10.5px] font-bold tracking-tight transition-all duration-300 hover:brightness-110`}>
                  <Award size={12} className={theme.text} />
                  <span>Certificate</span>
                </div>
              </div>

              {/* Credential Details */}
              <div className="flex gap-2 items-center text-[10.5px] text-slate-400 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60 font-mono mt-2">
                <ShieldCheck className={`shrink-0 ${theme.text}`} size={14} />
                <span className="leading-tight truncate">
                  <span className="font-extrabold text-slate-300">CREDENTIAL: </span>{intern.certificateDetails}
                </span>
              </div>

              {/* Elegant expandable curriculum/features module */}
              {intern.features && intern.features.length > 0 && (
                <div className="border border-slate-800/80 rounded-2xl overflow-hidden bg-[#0a0f1b]/50 mt-2">
                  <button 
                    onClick={() => toggleFeatures(intern.id)}
                    className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-300 hover:bg-slate-800/30 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen size={13} className={theme.text} />
                      Curriculum Deliverables
                    </span>
                    {isFeaturesExpanded ? <ChevronUp size={13} className="text-slate-400" /> : <ChevronDown size={13} className="text-slate-400" />}
                  </button>

                  <AnimatePresence initial={false}>
                    {isFeaturesExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-4 pb-4 pt-1 space-y-2 border-t border-slate-800/60 divide-y divide-slate-800/30">
                          {intern.features.map((feat, idx) => (
                            <div key={idx} className="text-[11px] text-slate-400 py-2 leading-relaxed font-medium flex items-start gap-2">
                              <Check size={11} className={`mt-0.5 shrink-0 ${theme.text}`} />
                              <span>{feat}</span>
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

          {/* Pricing & Apply Now Block */}
          <div className="p-6 pt-0 mt-auto space-y-4">
            <div className="flex items-center justify-between border-t border-slate-800/60 pt-4">
              <div>
                {intern.discountPrice && (
                  <span className="text-xs text-slate-500 font-medium line-through block leading-none mb-1">₹{intern.price}</span>
                )}
                <div className="text-xl font-black text-white tracking-tight">
                  ₹{intern.discountPrice || intern.price}
                  <span className="text-[8px] text-slate-500 block font-bold tracking-widest uppercase mt-0.5 font-mono">No Hidden Cost</span>
                </div>
              </div>
              <button 
                onClick={() => openApplyModel(intern)}
                className={`group/cta relative overflow-hidden bg-gradient-to-r ${theme.gradient} text-white text-xs font-black px-6 py-3.5 rounded-full transition-all duration-300 flex items-center gap-1.5 shadow-lg ${theme.shadowGlow} hover:-translate-y-1 cursor-pointer`}
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300" />
                <span>Apply Now</span>
                <ArrowRight size={14} className="transform translate-x-0 group-hover/cta:translate-x-1 transition-transform duration-300 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Internships() {
  const [internships, setInternships] = useState<InternshipProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedFeatures, setExpandedFeatures] = useState<string | null>(null);
  const [applyModelOpen, setApplyModelOpen] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState<InternshipProgram | null>(null);
  const { toast } = useToast();

  // Application Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('0');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    db.getInternships().then((data) => {
      setInternships(data.filter(i => i.isActive));
      setLoading(false);
    });
  }, []);

  const getCategory = (intern: InternshipProgram) => {
    const text = (intern.title + ' ' + intern.technology).toLowerCase();
    if (text.includes('cloud') || text.includes('devops') || text.includes('aws')) {
      return 'Cloud & DevOps';
    }
    if (text.includes('data') || text.includes('ai') || text.includes('machine') || text.includes('python')) {
      return 'AI & Data Science';
    }
    return 'Development';
  };

  const categories = ['All', 'Development', 'Cloud & DevOps', 'AI & Data Science'];

  const filteredInternships = activeCategory === 'All'
    ? internships
    : internships.filter(i => getCategory(i) === activeCategory);

  const toggleFeatures = (id: string) => {
    setExpandedFeatures(prev => (prev === id ? null : id));
  };

  const openApplyModel = (internship: InternshipProgram) => {
    setSelectedIntern(internship);
    setApplyModelOpen(true);
  };

  const closeApplyModel = () => {
    setApplyModelOpen(false);
    setSelectedIntern(null);
    setResumeName('');
    setFullName('');
    setEmail('');
    setPhone('');
    setCoverLetter('');
  };

  const handleResumeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeName(e.target.files[0].name);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      toast('Please fill out all required contact fields.', 'warning');
      return;
    }
    if (!resumeName) {
      toast('Please attach your technical Resume.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await db.createApplication({
        id: 'app_' + Date.now(),
        jobId: selectedIntern?.id || 'intern_custom',
        jobTitle: `Internship: ${selectedIntern?.title || 'Generic Track'}`,
        fullName,
        email,
        phone,
        experienceYears: Number(experience),
        resumeUrl: '#',
        coverLetter,
        status: 'Pending',
        createdAt: new Date().toISOString()
      });

      toast('Application submitted successfully! Our HR team will reach out shortly.', 'success');
      closeApplyModel();
    } catch (err) {
      toast('Failed to register application. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/10 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div id="internships-page-root" className="bg-[#040812] min-h-screen pb-24 text-slate-100 relative overflow-hidden">
      
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
      <div className="py-20 sm:py-24 text-center relative z-10 max-w-5xl mx-auto px-4 space-y-6 animate-fade-in">
        
        {/* SMALL LABEL: DIRECT CAREERS with tech dots and accent lines */}
        <div className="flex items-center justify-center gap-4 text-emerald-400 font-mono text-xs font-black tracking-[0.25em] uppercase select-none">
          <span className="flex items-center gap-1.5 opacity-80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-emerald-400" />
          </span>
          CAREERS ENABLEMENT
          <span className="flex items-center gap-1.5 opacity-80">
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-emerald-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </span>
        </div>

        {/* MAIN HEADING: Placement-Driven Internships with custom gradient highlight */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-white font-display">
          Placement-Driven <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.2)]">Internships</span>
        </h1>

        {/* SUBTITLE */}
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
          Gain direct experience on live enterprise repositories, receive formal code-review check-ins, upskill in modern technologies, and secure corporate placement.
        </p>

        {/* Minimal elegant horizontal green accent divider */}
        <div className="flex justify-center items-center gap-2 pt-2">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-emerald-500/50" />
          <div className="w-2 h-2 rounded-full border border-emerald-500/50" />
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-emerald-500/50" />
        </div>
      </div>

      {/* Main Grid Viewport */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-900/40 p-2 rounded-full border border-slate-800/50 backdrop-blur-md max-w-lg mx-auto">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-lg shadow-blue-500/15 scale-102 font-extrabold' 
                  : 'text-slate-400 hover:text-white transition-colors duration-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Internships Cards Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6"
        >
          {filteredInternships.map((intern) => (
            <PremiumInternshipCard 
              key={intern.id}
              intern={intern}
              expandedFeatures={expandedFeatures}
              toggleFeatures={toggleFeatures}
              openApplyModel={openApplyModel}
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

          {/* Request Custom Track Button with glow effect */}
          <Link
            to="/contact"
            className="relative px-8 py-4.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 text-white font-extrabold text-sm sm:text-base tracking-wider shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 group z-10"
          >
            <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="flex items-center gap-2.5">
              Request Custom Track <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
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

      {/* Dynamic Application Submission Modal */}
      {applyModelOpen && selectedIntern && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900/95 backdrop-blur-md rounded-[24px] border border-slate-800 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-scale-in max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={closeApplyModel}
              className="absolute top-6 right-6 p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="space-y-4 mb-6">
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider font-mono border border-blue-500/20">
                HR Fast-track
              </span>
              <h3 className="font-extrabold text-white text-xl leading-tight font-display">
                Apply for {selectedIntern.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Submit your credentials to our HR coordinator team. All submissions appear dynamically in the Super Admin dashboard activity feed.
              </p>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4 text-slate-100">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Full Name *</label>
                <input 
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Preeti Deshmukh"
                  className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Email Address *</label>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Phone Number *</label>
                  <input 
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 99887 76655"
                    className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Prior Tech Experience (Years)</label>
                <select 
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                >
                  <option value="0">Student / Fresher</option>
                  <option value="1">1 Year</option>
                  <option value="2">2+ Years</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Cover Note / Remarks</label>
                <textarea 
                  rows={2}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="I am highly motivated to work with React and Node.js..."
                  className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Upload Resume - Supports interactive drop select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Upload Resume (PDF/DOC) *</label>
                <div className="border-2 border-dashed border-slate-800 rounded-2xl p-4 text-center hover:border-blue-500 transition-colors bg-slate-950 relative">
                  <input 
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-1">
                    <FileText className="text-slate-500" size={24} />
                    {resumeName ? (
                      <span className="text-xs font-bold text-blue-400">{resumeName}</span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Click or Drag PDF file here to attach</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 hover:brightness-110 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Uploading Application...' : 'Submit Application Credentials'}
                  <Send size={14} />
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
