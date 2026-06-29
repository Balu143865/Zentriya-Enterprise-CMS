import React, { useState } from 'react';
import { motion } from 'motion/react';
import LucideIcon from './LucideIcon';
import { 
  Check, ShieldCheck, Cpu, Star, GraduationCap, Users, 
  Briefcase, TrendingUp, Target, Award, ArrowUpRight, CheckCircle2 
} from 'lucide-react';

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
  text: string;
  iconBg: string;
  dotColor: string;
  glowColor: string;
  checkBorder: string;
  checkBg: string;
}> = {
  Green: {
    accent: 'emerald-500',
    border: 'border-emerald-500/20 hover:border-emerald-500/40 focus:border-emerald-500/40',
    text: 'text-emerald-400',
    iconBg: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    dotColor: 'bg-emerald-500/80',
    glowColor: 'rgba(16,185,129,0.12)',
    checkBorder: 'border-emerald-500/30',
    checkBg: 'bg-emerald-500/5'
  },
  Blue: {
    accent: 'blue-500',
    border: 'border-blue-500/20 hover:border-blue-500/40 focus:border-blue-500/40',
    text: 'text-blue-400',
    iconBg: 'border-blue-500/30 bg-blue-500/5 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]',
    dotColor: 'bg-blue-500/80',
    glowColor: 'rgba(59,130,246,0.12)',
    checkBorder: 'border-blue-500/30',
    checkBg: 'bg-blue-500/5'
  },
  Purple: {
    accent: 'purple-500',
    border: 'border-purple-500/20 hover:border-purple-500/40 focus:border-purple-500/40',
    text: 'text-purple-400',
    iconBg: 'border-purple-500/30 bg-purple-500/5 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.15)]',
    dotColor: 'bg-purple-500/80',
    glowColor: 'rgba(168,85,247,0.12)',
    checkBorder: 'border-purple-500/30',
    checkBg: 'bg-purple-500/5'
  },
  Orange: {
    accent: 'orange-500',
    border: 'border-orange-500/20 hover:border-orange-500/40 focus:border-orange-500/40',
    text: 'text-orange-400',
    iconBg: 'border-orange-500/30 bg-orange-500/5 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.15)]',
    dotColor: 'bg-orange-500/80',
    glowColor: 'rgba(249,115,22,0.12)',
    checkBorder: 'border-orange-500/30',
    checkBg: 'bg-orange-500/5'
  },
  Cyan: {
    accent: 'cyan-500',
    border: 'border-cyan-500/20 hover:border-cyan-500/40 focus:border-cyan-500/40',
    text: 'text-cyan-400',
    iconBg: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    dotColor: 'bg-cyan-500/80',
    glowColor: 'rgba(6,182,212,0.12)',
    checkBorder: 'border-cyan-500/30',
    checkBg: 'bg-cyan-500/5'
  },
  Emerald: {
    accent: 'emerald-500',
    border: 'border-emerald-500/20 hover:border-emerald-500/40 focus:border-emerald-500/40',
    text: 'text-emerald-400',
    iconBg: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    dotColor: 'bg-emerald-500/80',
    glowColor: 'rgba(16,185,129,0.12)',
    checkBorder: 'border-emerald-500/30',
    checkBg: 'bg-emerald-500/5'
  },
  Indigo: {
    accent: 'indigo-500',
    border: 'border-indigo-500/20 hover:border-indigo-500/40 focus:border-indigo-500/40',
    text: 'text-indigo-400',
    iconBg: 'border-indigo-500/30 bg-indigo-500/5 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)]',
    dotColor: 'bg-indigo-500/80',
    glowColor: 'rgba(99,102,241,0.12)',
    checkBorder: 'border-indigo-500/30',
    checkBg: 'bg-indigo-500/5'
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
        className={`group relative rounded-[24px] overflow-hidden bg-[#070D19]/90 border ${theme.border} p-8 flex flex-col h-full justify-between transition-all duration-500 shadow-2xl hover:-translate-y-2.5`}
        style={{
          perspective: '1000px',
        }}
        onClick={(e) => handleButtonClick(srv, e)}
      >
        {/* Dynamic Card Inner Light Glow Follower */}
        {hasCoords && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-[24px] opacity-100 z-10"
            style={{
              background: `radial-gradient(280px circle at ${x}px ${y}px, ${theme.glowColor}, transparent 80%)`,
            }}
          />
        )}

        {/* Card Header & Content */}
        <div className="relative z-20 flex flex-col h-full justify-between">
          <div>
            {/* Top Line Cluster: Glowing circular Icon & Matrix Dots */}
            <div className="flex justify-between items-start">
              {/* Large circular glowing icon */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`w-16 h-16 rounded-full flex items-center justify-center border transition-all duration-500 shrink-0 ${theme.iconBg}`}
              >
                <LucideIcon name={srv.icon} size={26} />
              </motion.div>

              {/* Decorative 6x4 glowing dots matrix */}
              <div className="grid grid-cols-6 gap-1.5 opacity-25 group-hover:opacity-45 transition-all duration-300">
                {[...Array(24)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-1 rounded-full ${
                      i < 6 || i % 4 === 0 ? theme.dotColor : 'bg-slate-800'
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
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mt-4 font-light">
              {srv.description}
            </p>

            {/* Divider Line */}
            <div className="h-px bg-white/5 my-6 w-full" />

            {/* Feature Points list */}
            <ul className="space-y-4">
              {((srv.features && srv.features.length > 0) ? srv.features : [
                'Placement Readiness Mentorship',
                'Collaborative Group Projects',
                'Accredited Practical Learning',
                'Global Certifications Prep'
              ]).slice(0, 4).map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 group/item transition-colors duration-300 hover:text-white">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${theme.checkBorder} ${theme.checkBg} shrink-0 transition-transform duration-300 group-hover/item:scale-110`}>
                    <Check size={10} className={`${theme.text} stroke-[2.5px]`} />
                  </div>
                  <span className="font-light tracking-wide truncate">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card Footer with CTA Text Link */}
          <div className="mt-8 pt-4">
            <div className={`flex items-center gap-2 ${theme.text} font-bold text-xs sm:text-sm group/btn transition-transform duration-300`}>
              <span>View Domain Services</span>
              <span className="transform group-hover/btn:translate-x-1.5 transition-transform duration-300">→</span>
            </div>
          </div>
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
          
          {/* Custom vector header ornament exactly like reference */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 select-none">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                <div className="w-1 h-1 bg-emerald-500 rounded-full" />
              </div>
              <div className="w-12 h-[1px] bg-emerald-500" />
            </div>

            <span className="text-[#10B981] font-black tracking-[0.2em] text-[11px] sm:text-xs font-mono uppercase block">
              OUR SERVICES
            </span>

            <div className="flex items-center gap-2 select-none">
              <div className="w-12 h-[1px] bg-emerald-500" />
              <div className="w-2.5 h-2.5 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                <div className="w-1 h-1 bg-emerald-500 rounded-full" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none font-display pt-2">
            Solutions That <span className="text-[#3B82F6]">Drive</span> Your Growth
          </h2>

          <p className="text-slate-400 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-3xl mx-auto pt-1">
            End-to-end IT training, development, and innovation services designed to empower individuals and organizations.
          </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {row1.map(srv => renderCard(srv))}
          </div>

          {/* Desktop Second Row (remaining items, beautifully centered) */}
          {row2.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 max-w-[1220px] mx-auto">
              {row2.map(srv => renderCard(srv))}
            </div>
          )}
        </motion.div>

        {/* BOTTOM FEATURE STRIP */}
        <div className="mt-24 pt-4">
          <div className="bg-[#090F1C]/65 border border-white/[0.05] p-6 lg:p-8 rounded-[32px] backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.05]">
              
              {/* Feature 1 */}
              <div className="flex items-center gap-4 group/strip lg:px-4 first:pl-0">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover/strip:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(16,185,129,0.15)] shrink-0">
                  <Users size={22} className="stroke-[2px]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight text-white group-hover/strip:text-emerald-400 transition-colors duration-300">
                    Industry Expert Trainers
                  </h4>
                  <p className="text-xs text-slate-400 font-light mt-0.5">
                    Learn from real-world experts
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-4 group/strip pt-6 lg:pt-0 lg:px-6">
                <div className="w-14 h-14 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover/strip:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(59,130,246,0.15)] shrink-0">
                  <Briefcase size={22} className="stroke-[2px]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight text-white group-hover/strip:text-blue-400 transition-colors duration-300">
                    100% Practical Learning
                  </h4>
                  <p className="text-xs text-slate-400 font-light mt-0.5">
                    Build, implement & grow
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-4 group/strip pt-6 lg:pt-0 lg:px-6">
                <div className="w-14 h-14 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover/strip:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(168,85,247,0.15)] shrink-0">
                  <TrendingUp size={22} className="stroke-[2px]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight text-white group-hover/strip:text-purple-400 transition-colors duration-300">
                    Placement Assistance
                  </h4>
                  <p className="text-xs text-slate-400 font-light mt-0.5">
                    Strong industry connections
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-center gap-4 group/strip pt-6 lg:pt-0 lg:px-6 last:pr-0">
                <div className="w-14 h-14 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20 group-hover/strip:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(249,115,22,0.15)] shrink-0">
                  <ShieldCheck size={22} className="stroke-[2px]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight text-white group-hover/strip:text-orange-400 transition-colors duration-300">
                    Certified Programs
                  </h4>
                  <p className="text-xs text-slate-400 font-light mt-0.5">
                    Globally recognized certificates
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
