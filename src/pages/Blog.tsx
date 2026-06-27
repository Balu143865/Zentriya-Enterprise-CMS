import React, { useState, useEffect, useRef } from 'react';
import { db } from '../services/db';
import { BlogPost } from '../types';
import { 
  Search, Tag, Calendar, User, ArrowRight, X, Sparkles, 
  BookOpen, Clock, Cloud, Brain, Code, FileText, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Container variants for staggered card entry animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
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

// Lightweight interactive particle system
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {[...Array(20)].map((_, i) => {
        const size = Math.random() * 3 + 2;
        const delay = Math.random() * 5;
        const duration = Math.random() * 15 + 15;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        return (
          <div
            key={i}
            className="absolute rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 blur-[1px]"
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

interface PremiumBlogCardProps {
  post: BlogPost;
  onRead: (post: BlogPost) => void;
  key?: string | number;
}

export function PremiumBlogCard({ post, onRead }: PremiumBlogCardProps) {
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
    
    // Subtle 3D tilt rotation
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

  // Determine dynamic colors & glow shadows based on blog post category
  const getCardTheme = () => {
    const cat = post.category.toLowerCase();
    if (cat.includes('code') || cat.includes('development') || cat.includes('tech') || cat.includes('engineering')) {
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20 group-hover:border-emerald-500/50',
        glow: 'rgba(16, 185, 129, 0.15)',
        badgeGlow: 'bg-emerald-400',
        gradient: 'from-emerald-500 via-emerald-600 to-teal-600',
        shadowGlow: 'hover:shadow-[0_0_35px_rgba(16,185,129,0.22)]',
        chipBorder: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300'
      };
    } else if (cat.includes('cloud') || cat.includes('devops') || cat.includes('security')) {
      return {
        text: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20 group-hover:border-blue-500/50',
        glow: 'rgba(59, 130, 246, 0.15)',
        badgeGlow: 'bg-blue-400',
        gradient: 'from-blue-500 via-blue-600 to-indigo-600',
        shadowGlow: 'hover:shadow-[0_0_35px_rgba(59,130,246,0.22)]',
        chipBorder: 'border-blue-500/20 bg-blue-500/5 text-blue-300'
      };
    } else if (cat.includes('ai') || cat.includes('science') || cat.includes('data') || cat.includes('learning')) {
      return {
        text: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20 group-hover:border-purple-500/50',
        glow: 'rgba(168, 85, 247, 0.15)',
        badgeGlow: 'bg-purple-400',
        gradient: 'from-purple-500 via-purple-600 to-fuchsia-600',
        shadowGlow: 'hover:shadow-[0_0_35px_rgba(168,85,247,0.22)]',
        chipBorder: 'border-purple-500/20 bg-purple-500/5 text-purple-300'
      };
    } else {
      return {
        text: 'text-sky-400',
        bg: 'bg-sky-500/10',
        border: 'border-sky-500/20 group-hover:border-sky-500/50',
        glow: 'rgba(56, 189, 248, 0.15)',
        badgeGlow: 'bg-sky-400',
        gradient: 'from-sky-500 via-sky-600 to-blue-600',
        shadowGlow: 'hover:shadow-[0_0_35px_rgba(56,189,248,0.22)]',
        chipBorder: 'border-sky-500/20 bg-sky-500/5 text-sky-300'
      };
    }
  };

  const theme = getCardTheme();

  // Dynamic vector icon matching the content category
  const getCategoryIcon = () => {
    const text = (post.category + " " + post.title).toLowerCase();
    if (text.includes('code') || text.includes('development') || text.includes('react') || text.includes('engineering') || text.includes('software')) {
      return <Code className="text-emerald-400" size={22} />;
    }
    if (text.includes('cloud') || text.includes('serverless') || text.includes('devops') || text.includes('aws') || text.includes('docker') || text.includes('kubernetes')) {
      return <Cloud className="text-blue-400" size={22} />;
    }
    if (text.includes('ai') || text.includes('science') || text.includes('machine') || text.includes('brain') || text.includes('learning')) {
      return <Brain className="text-purple-400" size={22} />;
    }
    return <FileText className="text-sky-400" size={22} />;
  };

  return (
    <motion.div
      variants={cardVariants}
      className="h-full flex flex-col"
    >
      <div
        id={`blog-item-card-${post.id}`}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onRead(post)}
        className={`group relative h-full flex flex-col bg-[#0B1220] border ${theme.border} rounded-[24px] overflow-hidden transition-all duration-300 shadow-2xl ${theme.shadowGlow} cursor-pointer`}
        style={{
          transform: isHovered
            ? 'perspective(1000px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg)) translateY(-8px)'
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
          transition: isHovered ? 'transform 0.1s ease-out, border-color 0.3s ease' : 'transform 0.5s ease, border-color 0.5s ease'
        }}
      >
        {/* Dynamic radial spotlight cursor overlay */}
        <div
          className="absolute inset-0 rounded-[24px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
          style={{
            background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${theme.glow} 0%, transparent 100%)`
          }}
        />

        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Cover Image Header */}
            <div className="relative h-52 w-full overflow-hidden rounded-t-[23px] bg-slate-950">
              <img
                src={post.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&fit=crop&q=80'}
                alt={post.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Bottom depth gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/25 to-transparent z-10" />

              {/* Floating Pill Banner */}
              {post.featured && (
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="absolute top-4 left-4 z-20 bg-blue-600/90 backdrop-blur-md text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest border border-blue-400/20 text-white shadow-lg flex items-center gap-1.5"
                >
                  <Sparkles size={11} fill="white" />
                  <span>Featured</span>
                </motion.div>
              )}

              {/* Float Category Pill */}
              <div
                className="absolute top-4 right-4 z-20 bg-slate-900/80 backdrop-blur-md text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider border border-slate-700/40 text-slate-100 flex items-center gap-1.5"
              >
                <span>{post.category}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${theme.badgeGlow} animate-pulse`} />
              </div>

              {/* Tech Circular Overlapping Icon */}
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 w-14 h-14 rounded-full flex items-center justify-center bg-slate-950/95 border border-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md group-hover:scale-110 transition-all duration-300"
              >
                <span className={`absolute inset-0 rounded-full bg-gradient-to-tr ${theme.gradient} opacity-20 blur-md`} />
                <div className="relative z-10 flex items-center justify-center">
                  {getCategoryIcon()}
                </div>
              </motion.div>
            </div>

            {/* Main Content Area */}
            <div className="p-6 pt-10 space-y-4">
              {/* Publication timestamp metadata */}
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <User size={13} className={theme.text} />
                  <span>{post.author || 'Engineering Team'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className={theme.text} />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </span>
              </div>

              {/* Post Title */}
              <h3 className="font-extrabold text-white text-lg sm:text-xl tracking-tight leading-snug group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                {post.title}
              </h3>

              {/* Post Excerpt */}
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light line-clamp-3">
                {post.excerpt}
              </p>

              {/* Dynamic decorative chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {post.tags && post.tags.slice(0, 3).map((tag, idx) => (
                  <div key={idx} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border ${theme.chipBorder} text-[9.5px] font-bold tracking-tight transition-all hover:brightness-115`}>
                    <Tag size={10} className="opacity-70" />
                    <span>#{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Read CTA Button */}
          <div className="p-6 pt-0 mt-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRead(post);
              }}
              className={`group/cta relative w-full overflow-hidden bg-gradient-to-r ${theme.gradient} text-white text-xs font-black py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg ${theme.shadowGlow} hover:-translate-y-0.5`}
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300" />
              <span>Read Full Article</span>
              <ArrowRight size={14} className="transform translate-x-0 group-hover/cta:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeReadBlog, setActiveReadBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    db.getBlogs().then((data) => {
      setBlogs(data);
      setLoading(false);
    });
  }, []);

  const categories = ['All', ...Array.from(new Set(blogs.map(b => b.category)))];

  const filteredBlogs = blogs.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/10 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div id="blog-page-root" className="bg-[#040812] min-h-screen pb-24 text-slate-100 relative overflow-hidden">
      
      {/* Mesh grid backgrounds & radial vector beams */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none select-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12)_0%,rgba(16,185,129,0.04)_50%,transparent_100%)] pointer-events-none select-none z-0" />
      
      {/* Soft colorized glow spotlights */}
      <div className="absolute top-[25%] left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-[55%] right-1/4 w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[80%] left-1/3 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[110px] pointer-events-none z-0" />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Hero Header Section */}
      <div className="py-20 sm:py-24 text-center relative z-10 max-w-5xl mx-auto px-4 space-y-6">
        {/* Dynamic Label */}
        <div className="flex items-center justify-center gap-4 text-emerald-400 font-mono text-xs font-black tracking-[0.25em] uppercase select-none">
          <span className="flex items-center gap-1.5 opacity-80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-emerald-400" />
          </span>
          OUR JOURNAL
          <span className="flex items-center gap-1.5 opacity-80">
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-emerald-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-white font-display">
          Journal & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.2)]">Software</span> Insights
        </h1>

        {/* Subtitle description */}
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
          In-depth technical papers, engineering blueprints, system design strategies, and cutting-edge corporate research indices.
        </p>

        {/* Elegant horizontal green vector separator */}
        <div className="flex justify-center items-center gap-2 pt-2">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-emerald-500/50" />
          <div className="w-2 h-2 rounded-full border border-emerald-500/50" />
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-emerald-500/50" />
        </div>
      </div>

      {/* Main Grid Viewport */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Filter Navigation & Search Bar Component Grid */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 bg-[#0b1220]/70 p-3 rounded-[24px] border border-slate-800/60 backdrop-blur-xl max-w-4xl mx-auto">
          {/* Categories select pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4.5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-lg shadow-blue-500/15 scale-102 font-extrabold' 
                    : 'text-slate-400 hover:text-white transition-colors duration-200 hover:bg-slate-800/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Modern high-tech Search Bar input box */}
          <div className="flex items-center gap-2.5 bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-full w-full md:w-72 shadow-inner">
            <Search size={15} className="text-emerald-400" />
            <input 
              type="text" 
              placeholder="Search software articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 ring-0 focus:ring-0 text-xs text-slate-100 placeholder-slate-500 outline-none w-full font-medium"
            />
          </div>
        </div>

        {/* Dynamic Blog Grid */}
        {filteredBlogs.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6"
          >
            {filteredBlogs.map((post) => (
              <PremiumBlogCard 
                key={post.id}
                post={post}
                onRead={setActiveReadBlog}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-[#0B1220]/45 border border-slate-800/80 rounded-3xl max-w-xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
            <ShieldAlert className="mx-auto text-amber-500/80 mb-3.5" size={32} />
            <p className="text-slate-400 text-sm font-semibold tracking-wide">No engineering logs matching this search criteria.</p>
          </div>
        )}

        {/* Secondary decorative bottom curves */}
        <div className="relative flex justify-center items-center py-10 select-none">
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
        </div>
      </div>

      {/* Advanced Full Screen glassmorphism article viewer */}
      <AnimatePresence>
        {activeReadBlog && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-[#0B1220] rounded-[32px] border border-slate-800/80 max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col"
            >
              {/* Top Banner Cover within details Modal */}
              <div className="relative h-44 sm:h-64 w-full bg-slate-950 shrink-0">
                <img 
                  src={activeReadBlog.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&fit=crop&q=80'} 
                  alt={activeReadBlog.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/40 to-transparent" />
                
                {/* Close modal floating badge icon button */}
                <button 
                  onClick={() => setActiveReadBlog(null)}
                  className="absolute top-5 right-5 p-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-full text-slate-300 hover:text-white transition-all shadow-lg hover:scale-105 active:scale-95"
                  title="Close Reader"
                >
                  <X size={16} />
                </button>

                {/* Categories Floating Indicator */}
                <div className="absolute bottom-4 left-6 sm:left-8 z-10 flex items-center gap-2">
                  <span className="text-[10px] bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    {activeReadBlog.category}
                  </span>
                </div>
              </div>

              {/* Scrollable content section */}
              <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-11rem)]">
                
                {/* Header context */}
                <div className="space-y-3.5 border-b border-slate-800/80 pb-5">
                  <h1 className="font-extrabold text-white text-xl sm:text-2xl md:text-3xl leading-snug tracking-tight font-display">
                    {activeReadBlog.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-400 text-xs font-semibold font-mono">
                    <span className="flex items-center gap-1.5 text-blue-400">
                      <User size={13} />
                      {activeReadBlog.author || 'Senior Architect'}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      {new Date(activeReadBlog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Subtitle/Excerpt */}
                <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-emerald-500 pl-4 font-medium italic">
                  {activeReadBlog.excerpt}
                </p>

                {/* Main Content Render */}
                <div 
                  className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 prose prose-invert max-w-none prose-headings:text-white prose-a:text-emerald-400 hover:prose-a:text-emerald-300 font-light"
                  dangerouslySetInnerHTML={{ __html: activeReadBlog.content }}
                />

                {/* Bottom Tags system */}
                {activeReadBlog.tags && activeReadBlog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 items-center pt-6 border-t border-slate-800/80">
                    <Tag size={13} className="text-slate-400 shrink-0" />
                    {activeReadBlog.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-3 py-1 rounded-full font-bold uppercase transition-all hover:border-blue-500/40 hover:text-blue-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Drawer Actions */}
              <div className="p-5 border-t border-slate-800/80 bg-slate-950/50 flex justify-end shrink-0">
                <button
                  onClick={() => setActiveReadBlog(null)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold rounded-full transition-colors"
                >
                  Finished Reading
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
