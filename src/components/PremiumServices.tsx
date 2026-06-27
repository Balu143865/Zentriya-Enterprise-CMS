import React, { useState } from 'react';
import { motion } from 'motion/react';
import LucideIcon from './LucideIcon';
import { Check, ShieldCheck, Cpu, Star, GraduationCap, Users } from 'lucide-react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  icon: string;
  imageUrl: string;
  features?: string[];
  benefits?: string[];
  order?: number;
  isActive?: boolean;
  themeColor?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface PremiumServicesProps {
  services: ServiceItem[];
  onSelectService?: (service: ServiceItem) => void;
}

const colorThemes: Record<string, {
  accent: string;
  border: string;
  bgGlow: string;
  text: string;
  iconBg: string;
  buttonBg: string;
  buttonGlow: string;
  dotColor: string;
}> = {
  Green: {
    accent: 'emerald-500',
    border: 'border-emerald-500/20 group-hover:border-emerald-500/50',
    bgGlow: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    buttonBg: 'from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400',
    buttonGlow: 'shadow-emerald-500/30 hover:shadow-emerald-500/50',
    dotColor: 'bg-emerald-400'
  },
  Blue: {
    accent: 'blue-500',
    border: 'border-blue-500/20 group-hover:border-blue-500/50',
    bgGlow: 'bg-blue-500/10',
    text: 'text-blue-400',
    iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]',
    buttonBg: 'from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400',
    buttonGlow: 'shadow-blue-500/30 hover:shadow-blue-500/50',
    dotColor: 'bg-blue-400'
  },
  Purple: {
    accent: 'purple-500',
    border: 'border-purple-500/20 group-hover:border-purple-500/50',
    bgGlow: 'bg-purple-500/10',
    text: 'text-purple-400',
    iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]',
    buttonBg: 'from-purple-600 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-400',
    buttonGlow: 'shadow-purple-500/30 hover:shadow-purple-500/50',
    dotColor: 'bg-purple-400'
  },
  Orange: {
    accent: 'orange-500',
    border: 'border-orange-500/20 group-hover:border-orange-500/50',
    bgGlow: 'bg-orange-500/10',
    text: 'text-orange-400',
    iconBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.15)]',
    buttonBg: 'from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400',
    buttonGlow: 'shadow-orange-500/30 hover:shadow-orange-500/50',
    dotColor: 'bg-orange-400'
  },
  Cyan: {
    accent: 'cyan-500',
    border: 'border-cyan-500/20 group-hover:border-cyan-500/50',
    bgGlow: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    buttonBg: 'from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400',
    buttonGlow: 'shadow-cyan-500/30 hover:shadow-cyan-500/50',
    dotColor: 'bg-cyan-400'
  },
  Emerald: {
    accent: 'emerald-500',
    border: 'border-emerald-500/20 group-hover:border-emerald-500/50',
    bgGlow: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    buttonBg: 'from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400',
    buttonGlow: 'shadow-emerald-500/30 hover:shadow-emerald-500/50',
    dotColor: 'bg-emerald-400'
  },
  Indigo: {
    accent: 'indigo-500',
    border: 'border-indigo-500/20 group-hover:border-indigo-500/50',
    bgGlow: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]',
    buttonBg: 'from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400',
    buttonGlow: 'shadow-indigo-500/30 hover:shadow-indigo-500/50',
    dotColor: 'bg-indigo-400'
  }
};

const getTheme = (color?: string) => {
  if (!color) return colorThemes.Blue;
  const normalized = color.charAt(0).toUpperCase() + color.slice(1).toLowerCase();
  return colorThemes[normalized] || colorThemes.Blue;
};

export default function PremiumServices({ services, onSelectService }: PremiumServicesProps) {
  const row1 = services.slice(0, 4);
  const row2 = services.slice(4);

  // Parallax / Hover coordinates tracker
  const [coords, setCoords] = useState<Record<string, { x: number; y: number }>>({});

  const handleMouseMove = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords(prev => ({
      ...prev,
      [id]: { x, y }
    }));
  };

  const handleMouseLeave = (id: string) => {
    setCoords(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 18,
      },
    },
  };

  const handleButtonClick = (srv: ServiceItem, e: React.MouseEvent) => {
    if (onSelectService) {
      e.preventDefault();
      onSelectService(srv);
    } else {
      // If we are on Home page, navigate or let default href handle it.
      const btnLink = srv.buttonLink || `/services?id=${srv.id}`;
      window.location.href = btnLink;
    }
  };

  const renderCard = (srv: ServiceItem) => {
    const theme = getTheme(srv.themeColor);
    const hasCoords = coords[srv.id] !== undefined;
    const { x, y } = coords[srv.id] || { x: 0, y: 0 };

    return (
      <motion.div
        key={srv.id}
        variants={cardVariants}
        onMouseMove={(e) => handleMouseMove(srv.id, e)}
        onMouseLeave={() => handleMouseLeave(srv.id)}
        className="group relative rounded-[24px] overflow-hidden bg-[#0B1220] border border-white/[0.05] hover:border-transparent p-8 flex flex-col h-full justify-between transition-all duration-500 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-pointer hover:-translate-y-3"
        style={{
          // Custom perspective for rich hover feel
          perspective: '1000px',
        }}
        onClick={(e) => handleButtonClick(srv, e)}
      >
        {/* Dynamic Interactive Border Radial Beam */}
        {hasCoords && (
          <div
            className="absolute inset-0 z-30 pointer-events-none rounded-[24px] transition-opacity duration-300"
            style={{
              background: `radial-gradient(450px circle at ${x}px ${y}px, var(--border-glow-color, rgba(255,255,255,0.12)), transparent 40%)`,
              border: '1px solid transparent',
              WebkitMaskImage: 'radial-gradient(circle, white, transparent)',
              maskImage: 'radial-gradient(circle, white, transparent)',
            }}
          />
        )}

        {/* Dynamic Card Inner Light Glow Follower */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
          style={{
            background: hasCoords
              ? `radial-gradient(280px circle at ${x}px ${y}px, rgba(15, 23, 42, 0.65), transparent)`
              : 'none',
          }}
        />

        {/* Custom Glow Aura behind icon */}
        <div className={`absolute top-0 left-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-all duration-700 pointer-events-none -translate-x-1/3 -translate-y-1/3 ${theme.bgGlow}`} />

        {/* Background Image with Dark Linear Gradient Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[24px]">
          <img
            src={srv.imageUrl}
            alt={srv.title}
            className="w-full h-full object-cover opacity-8 group-hover:opacity-18 group-hover:scale-110 transition-all duration-700 mix-blend-overlay filter brightness-[0.7] saturate-[0.8]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/70 via-[#0B1220]/95 to-[#0B1220]" />
        </div>

        {/* Card Header & Content */}
        <div className="relative z-10">
          {/* Top Line Cluster: Glowing circular Icon & Matrix Dots */}
          <div className="flex justify-between items-start">
            {/* Large circular glowing icon */}
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${theme.iconBg}`}
            >
              <LucideIcon name={srv.icon} size={26} />
            </motion.div>

            {/* Decorative 6x4 glowing dots matrix */}
            <div className="grid grid-cols-4 gap-1.5 opacity-25 group-hover:opacity-50 transition-all duration-500">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i % 3 === 0 ? theme.dotColor : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Service Name */}
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all duration-300 font-display">
            {srv.title}
          </h3>

          {/* Description */}
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mt-4 font-light line-clamp-3">
            {srv.description}
          </p>

          {/* Divider Line */}
          <div className="h-px bg-white/5 my-5 w-full" />

          {/* Feature Points list */}
          <ul className="space-y-3.5">
            {((srv.features && srv.features.length > 0) ? srv.features : [
              'Placement Readiness Mentorship',
              'Collaborative Group Projects',
              'Accredited Practical Learning',
              'Global Certifications Prep'
            ]).slice(0, 4).map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 group/item transition-colors duration-300 hover:text-white">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border border-white/5 transition-all duration-300 ${theme.bgGlow} group-hover:scale-110`}>
                  <Check size={11} className={`${theme.text} stroke-[3px]`} />
                </div>
                <span className="font-light tracking-wide truncate">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card Footer with CTA Button */}
        <div className="relative z-10 mt-8 pt-4">
          <button
            onClick={(e) => handleButtonClick(srv, e)}
            className={`w-full py-3.5 px-6 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${theme.buttonBg} ${theme.buttonGlow} flex items-center justify-center gap-2 group-hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-lg relative overflow-hidden`}
          >
            {/* Subtle overlay shine wave */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

            <span>{srv.buttonText || 'View Service →'}</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="text-sm shrink-0"
            >
              →
            </motion.span>
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full bg-[#050B14] text-white py-24 sm:py-28 relative overflow-hidden">
      {/* Immersive Deep Tech Space Backdrop Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1322_1px,transparent_1px),linear-gradient(to_bottom,#0c1322_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] opacity-75 pointer-events-none" />

      {/* Background radial soft light gradient arrays */}
      <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-4xl mx-auto mb-20 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-emerald-500" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 font-extrabold tracking-[0.2em] text-[11px] sm:text-xs font-mono uppercase block">
              OUR SERVICES
            </span>
            <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-emerald-500" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none font-display">
            Solutions That <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-teal-400">Drive</span> Your Growth
          </h2>

          <p className="text-slate-400 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-3xl mx-auto">
            End-to-end IT training, software development, consulting, and innovation services designed to empower students, professionals, and organizations.
          </p>

          {/* Elegant decorative green divider lines */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-emerald-500/50" />
            <div className="w-2.5 h-2.5 rounded-full border border-emerald-400 flex items-center justify-center">
              <div className="w-1 h-1 bg-emerald-400 rounded-full" />
            </div>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-emerald-500/50" />
          </div>
        </div>

        {/* SERVICES CARDS WRAPPER */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-8"
        >
          {/* Desktop First Row (4 items) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {row1.map(srv => renderCard(srv))}
          </div>

          {/* Desktop Second Row (3 items) */}
          {row2.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1120px] mx-auto">
              {row2.map(srv => renderCard(srv))}
            </div>
          )}
        </motion.div>

        {/* BOTTOM FEATURE STRIP */}
        <div className="mt-24 pt-10 border-t border-white/[0.05]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="group/strip flex items-center gap-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02] hover:border-white/[0.05] p-5 rounded-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover/strip:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <GraduationCap size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight text-white group-hover/strip:text-emerald-400 transition-colors">Industry Expert Trainers</h4>
                <p className="text-[11px] text-slate-400 font-light">Learn directly from senior architects</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group/strip flex items-center gap-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02] hover:border-white/[0.05] p-5 rounded-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover/strip:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <Cpu size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight text-white group-hover/strip:text-blue-400 transition-colors">100% Practical Learning</h4>
                <p className="text-[11px] text-slate-400 font-light">Real projects and lab-first sandboxes</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group/strip flex items-center gap-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02] hover:border-white/[0.05] p-5 rounded-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover/strip:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                <Users size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight text-white group-hover/strip:text-purple-400 transition-colors">Placement Assistance</h4>
                <p className="text-[11px] text-slate-400 font-light">Direct referrals and resume branding</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group/strip flex items-center gap-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02] hover:border-white/[0.05] p-5 rounded-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover/strip:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight text-white group-hover/strip:text-indigo-400 transition-colors">Certified Programs</h4>
                <p className="text-[11px] text-slate-400 font-light">Globally accredited validation badges</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
