import React, { useState, useEffect, useRef } from 'react';
import { db } from '../services/db';
import { Article, ArticleCategory, ArticleStatistic } from '../types';
import { 
  Search, Tag, Calendar, User, ArrowRight, X, Sparkles, 
  BookOpen, Clock, Cloud, Brain, Code, FileText, ShieldAlert,
  Users, Eye, Download, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedHeader } from '../components/AnimatedTransitions';

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

// CountUpStat Component matching Home.tsx behavior
const CountUpStat = ({ value, label, icon: IconName }: { value: string, label: string, icon: string, key?: any }) => {
  const [count, setCount] = useState(0);
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
  const suffix = value.replace(/[0-9.]/g, '');

  useEffect(() => {
    let start = 0;
    const end = numericValue;
    if (end === 0) return;
    const duration = 1500; // ms
    const increment = end / (duration / 16); // ~60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [numericValue]);

  const getIcon = () => {
    switch (IconName) {
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      case 'Users': return <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'Eye': return <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
      case 'Download': return <Download className="w-6 h-6 text-orange-600 dark:text-orange-400" />;
      case 'Star': return <Star className="w-6 h-6 text-blue-500 dark:text-blue-300 fill-blue-500/20" />;
      default: return <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getBg = () => {
    switch (IconName) {
      case 'BookOpen': return 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/30';
      case 'Users': return 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/30';
      case 'Eye': return 'bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/30';
      case 'Download': return 'bg-orange-50 dark:bg-orange-950/40 border-orange-100 dark:border-orange-900/30';
      case 'Star': return 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/30';
      default: return 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/30';
    }
  };

  const displayVal = count % 1 === 0 ? count : count.toFixed(1);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl bg-white/90 dark:bg-slate-900/40 backdrop-blur border border-slate-200/80 dark:border-slate-800/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:border-blue-200/60 dark:hover:border-blue-900/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex-1 min-w-[200px] text-center sm:text-left justify-center sm:justify-start">
      <div className={`p-3.5 rounded-xl border ${getBg()} shrink-0 shadow-sm`}>
        {getIcon()}
      </div>
      <div className="space-y-0.5">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {displayVal}{suffix}
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {label}
        </div>
      </div>
    </div>
  );
};

interface PremiumBlogCardProps {
  article: Article;
  onRead: (article: Article) => void;
  key?: string | number;
}

export function PremiumBlogCard({ article, onRead }: PremiumBlogCardProps) {
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

  // Determine dynamic colors & glow shadows based on article category
  const getCardTheme = () => {
    const cat = article.category.toLowerCase();
    if (cat.includes('code') || cat.includes('development') || cat.includes('tech') || cat.includes('engineering')) {
      return {
        text: 'text-emerald-500 dark:text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-slate-200/80 dark:border-emerald-500/20 group-hover:border-emerald-500/50',
        glow: 'rgba(16, 185, 129, 0.15)',
        badgeGlow: 'bg-emerald-400',
        gradient: 'from-emerald-500 via-emerald-600 to-teal-600',
        shadowGlow: 'hover:shadow-[0_15px_40px_rgba(16,185,129,0.15)] dark:hover:shadow-[0_0_35px_rgba(16,185,129,0.22)]',
        chipBorder: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-300'
      };
    } else if (cat.includes('cloud') || cat.includes('devops') || cat.includes('security')) {
      return {
        text: 'text-blue-500 dark:text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-slate-200/80 dark:border-blue-500/20 group-hover:border-blue-500/50',
        glow: 'rgba(59, 130, 246, 0.15)',
        badgeGlow: 'bg-blue-400',
        gradient: 'from-blue-500 via-blue-600 to-indigo-600',
        shadowGlow: 'hover:shadow-[0_15px_40px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_0_35px_rgba(59,130,246,0.22)]',
        chipBorder: 'border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-300'
      };
    } else if (cat.includes('ai') || cat.includes('science') || cat.includes('data') || cat.includes('learning')) {
      return {
        text: 'text-purple-500 dark:text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-slate-200/80 dark:border-purple-500/20 group-hover:border-purple-500/50',
        glow: 'rgba(168, 85, 247, 0.15)',
        badgeGlow: 'bg-purple-400',
        gradient: 'from-purple-500 via-purple-600 to-fuchsia-600',
        shadowGlow: 'hover:shadow-[0_15px_40px_rgba(168,85,247,0.15)] dark:hover:shadow-[0_0_35px_rgba(168,85,247,0.22)]',
        chipBorder: 'border-purple-500/20 bg-purple-500/5 text-purple-600 dark:text-purple-300'
      };
    } else {
      return {
        text: 'text-sky-500 dark:text-sky-400',
        bg: 'bg-sky-500/10',
        border: 'border-slate-200/80 dark:border-sky-500/20 group-hover:border-sky-500/50',
        glow: 'rgba(56, 189, 248, 0.15)',
        badgeGlow: 'bg-sky-400',
        gradient: 'from-sky-500 via-sky-600 to-blue-600',
        shadowGlow: 'hover:shadow-[0_15px_40px_rgba(56,189,248,0.15)] dark:hover:shadow-[0_0_35px_rgba(56,189,248,0.22)]',
        chipBorder: 'border-sky-500/20 bg-sky-500/5 text-sky-600 dark:text-sky-300'
      };
    }
  };

  const theme = getCardTheme();

  // Dynamic vector icon matching the content category
  const getCategoryIcon = () => {
    const text = (article.category + " " + article.title).toLowerCase();
    if (text.includes('code') || text.includes('development') || text.includes('react') || text.includes('engineering') || text.includes('software')) {
      return <Code className="text-emerald-500 dark:text-emerald-400" size={22} />;
    }
    if (text.includes('cloud') || text.includes('serverless') || text.includes('devops') || text.includes('aws') || text.includes('docker') || text.includes('kubernetes')) {
      return <Cloud className="text-blue-500 dark:text-blue-400" size={22} />;
    }
    if (text.includes('ai') || text.includes('science') || text.includes('machine') || text.includes('brain') || text.includes('learning')) {
      return <Brain className="text-purple-500 dark:text-purple-400" size={22} />;
    }
    return <FileText className="text-sky-500 dark:text-sky-400" size={22} />;
  };

  const tags = [
    article.category,
    article.author_designation || 'Consultant',
    article.read_time
  ];

  const isFeatured = article.display_order === 1;

  return (
    <motion.div
      variants={cardVariants}
      className="h-full flex flex-col"
    >
      <div
        id={`blog-item-card-${article.id}`}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onRead(article)}
        className={`group relative h-full flex flex-col bg-white/80 dark:bg-[#0B1220]/75 backdrop-blur-md border ${theme.border} rounded-[24px] overflow-hidden transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-2xl ${theme.shadowGlow} cursor-pointer`}
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
            <div className="relative h-52 w-full overflow-hidden rounded-t-[23px] bg-slate-100 dark:bg-slate-950">
              <img
                src={article.cover_image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&fit=crop&q=80'}
                alt={article.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Bottom depth gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-50/20 dark:from-[#0B1220] via-transparent to-transparent z-10" />

              {/* Floating Pill Banner */}
              {isFeatured && (
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
                className="absolute top-4 right-4 z-20 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider border border-slate-200 dark:border-slate-700/40 text-slate-800 dark:text-slate-100 flex items-center gap-1.5 shadow-sm"
              >
                <span>{article.category}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${theme.badgeGlow} animate-pulse`} />
              </div>

              {/* Tech Circular Overlapping Icon */}
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 w-14 h-14 rounded-full flex items-center justify-center bg-white dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md group-hover:scale-110 transition-all duration-300"
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
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <User size={13} className={theme.text} />
                  <span className="text-slate-600 dark:text-slate-400">{article.author_name || 'Engineering Team'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className={theme.text} />
                  <span className="text-slate-600 dark:text-slate-400">
                    {new Date(article.published_at || article.published_date || '').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </span>
              </div>

              {/* Post Title */}
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg sm:text-xl tracking-tight leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2 font-display">
                {article.title}
              </h3>

              {/* Post Excerpt */}
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-light line-clamp-3">
                {article.description || article.excerpt}
              </p>

              {/* Dynamic decorative chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {tags.map((tag, idx) => (
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
                onRead(article);
              }}
              className={`group/cta relative w-full overflow-hidden bg-gradient-to-r ${theme.gradient} text-white text-xs font-black py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg ${theme.shadowGlow} hover:-translate-y-0.5 cursor-pointer`}
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
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>(['All Articles']);
  const [stats, setStats] = useState<ArticleStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Articles');
  const [activeReadArticle, setActiveReadArticle] = useState<Article | null>(null);

  useEffect(() => {
    Promise.all([
      db.getArticles(),
      db.getArticleCategories(),
      db.getArticleStatistics()
    ]).then(([articlesData, categoriesData, statsData]) => {
      // Filter active articles and sort them by display_order
      const activeArticles = articlesData
        .filter(a => a.is_active)
        .sort((a, b) => (a.display_order ?? 99) - (b.display_order ?? 99));
      
      setArticles(activeArticles);

      // Map dynamic categories
      const categoryNames = categoriesData
        .sort((a, b) => (a.display_order ?? 99) - (b.display_order ?? 99))
        .map(c => c.name);
      
      // Ensure "All Articles" is included or renamed correctly
      const finalCats = ['All Articles', ...categoryNames.filter(n => n !== 'All Articles')];
      setCategories(finalCats);

      // Save statistics
      setStats(statsData.sort((a, b) => (a.display_order ?? 99) - (b.display_order ?? 99)));
      
      setLoading(false);
    }).catch(err => {
      console.error("Error loading articles data:", err);
      setLoading(false);
    });
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'All Articles' || 
      article.category.toLowerCase().includes(activeCategory.toLowerCase()) || 
      activeCategory.toLowerCase().includes(article.category.toLowerCase());

    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (article.description && article.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          article.author_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/10 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div id="blog-page-root" className="bg-slate-50 dark:bg-[#040812] min-h-screen pb-24 text-slate-800 dark:text-slate-100 relative overflow-hidden transition-colors duration-300">
      
      {/* Mesh grid backgrounds & radial vector beams */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none select-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08)_0%,rgba(16,185,129,0.03)_50%,transparent_100%)] pointer-events-none select-none z-0" />
      
      {/* Soft colorized glow spotlights */}
      <div className="absolute top-[25%] left-1/4 w-[400px] h-[400px] bg-emerald-500/3 dark:bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-[55%] right-1/4 w-[450px] h-[450px] bg-blue-500/3 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[80%] left-1/3 w-[400px] h-[400px] bg-purple-500/3 dark:bg-purple-500/5 rounded-full blur-[110px] pointer-events-none z-0" />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Hero Header Section */}
      <AnimatedHeader className="py-20 sm:py-24 text-center relative z-10 max-w-5xl mx-auto px-4 space-y-6">
        {/* Dynamic Label */}
        <div className="flex items-center justify-center gap-4 text-blue-600 dark:text-emerald-400 font-mono text-xs font-black tracking-[0.25em] uppercase select-none">
          <span className="flex items-center gap-1.5 opacity-80">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-emerald-400 animate-pulse" />
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-blue-600 dark:to-emerald-400" />
          </span>
          TECH INSIGHTS
          <span className="flex items-center gap-1.5 opacity-80">
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-blue-600 dark:to-emerald-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-emerald-400 animate-pulse" />
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-slate-900 dark:text-white font-display">
          Journal & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 dark:from-blue-400 dark:via-sky-400 dark:to-cyan-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.15)]">Software</span> Insights
        </h1>

        {/* Subtitle description */}
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
          In-depth technical papers, engineering blueprints, system design strategies, and cutting-edge corporate research indices.
        </p>

        {/* Elegant horizontal green vector separator */}
        <div className="flex justify-center items-center gap-2 pt-2">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-blue-500 dark:to-emerald-500/50" />
          <div className="w-2 h-2 rounded-full border border-blue-500 dark:border-emerald-500/50" />
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-blue-500 dark:to-emerald-500/50" />
        </div>
      </AnimatedHeader>

      {/* Main Grid Viewport */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Filter Navigation & Search Bar Component Grid */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 bg-white/90 dark:bg-[#0b1220]/70 p-3 rounded-[24px] border border-slate-200/80 dark:border-slate-800/60 backdrop-blur-xl max-w-5xl mx-auto shadow-sm">
          {/* Categories select pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4.5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                  activeCategory === cat 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-600 dark:to-emerald-500 text-white shadow-lg shadow-blue-500/15 scale-102 font-extrabold' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Modern high-tech Search Bar input box */}
          <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-full w-full md:w-72 shadow-inner">
            <Search size={15} className="text-blue-600 dark:text-emerald-400" />
            <input 
              type="text" 
              placeholder="Search software articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 ring-0 focus:ring-0 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none w-full font-medium"
            />
          </div>
        </div>

        {/* Dynamic Blog Grid */}
        {filteredArticles.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6"
          >
            {filteredArticles.map((article) => (
              <PremiumBlogCard 
                key={article.id}
                article={article}
                onRead={setActiveReadArticle}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white/80 dark:bg-[#0B1220]/45 border border-slate-200 dark:border-slate-800/80 rounded-3xl max-w-xl mx-auto relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
            <ShieldAlert className="mx-auto text-amber-500/80 mb-3.5" size={32} />
            <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold tracking-wide">No engineering logs matching this search criteria.</p>
          </div>
        )}

        {/* Statistics Bar incorporated in Reference Design */}
        {stats.length > 0 && (
          <div className="mt-24 border-t border-slate-200 dark:border-slate-800/40 pt-16 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 font-mono">
                — OUR REACH & COMPLIANCE IN NUMBERS —
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {stats.map((stat) => (
                <CountUpStat 
                  key={stat.id}
                  value={stat.value}
                  label={stat.label}
                  icon={stat.icon}
                />
              ))}
            </div>
          </div>
        )}

        {/* Secondary decorative bottom curves */}
        <div className="relative flex justify-center items-center py-10 select-none">
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-800 to-transparent" />
        </div>
      </div>

      {/* Advanced Full Screen glassmorphism article viewer */}
      <AnimatePresence>
        {activeReadArticle && (
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
              className="bg-white dark:bg-[#0B1220] rounded-[32px] border border-slate-200 dark:border-slate-800/80 max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col text-slate-800 dark:text-slate-100"
            >
              {/* Top Banner Cover within details Modal */}
              <div className="relative h-44 sm:h-64 w-full bg-slate-200 dark:bg-slate-950 shrink-0">
                <img 
                  src={activeReadArticle.cover_image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&fit=crop&q=80'} 
                  alt={activeReadArticle.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0B1220] via-white/10 dark:via-[#0B1220]/40 to-transparent" />
                
                {/* Close modal floating badge icon button */}
                <button 
                  onClick={() => setActiveReadArticle(null)}
                  className="absolute top-5 right-5 p-2 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-full transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
                  title="Close Reader"
                >
                  <X size={16} />
                </button>

                {/* Categories Floating Indicator */}
                <div className="absolute bottom-4 left-6 sm:left-8 z-10 flex items-center gap-2">
                  <span className="text-[10px] bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-600 dark:to-emerald-500 text-white font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    {activeReadArticle.category}
                  </span>
                </div>
              </div>

              {/* Scrollable content section */}
              <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-11rem)]">
                
                {/* Header context */}
                <div className="space-y-3.5 border-b border-slate-200 dark:border-slate-800/80 pb-5">
                  <h1 className="font-extrabold text-slate-900 dark:text-white text-xl sm:text-2xl md:text-3xl leading-snug tracking-tight font-display">
                    {activeReadArticle.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500 dark:text-slate-400 text-xs font-semibold font-mono">
                    <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                      <User size={13} />
                      {activeReadArticle.author_name || 'Senior Architect'}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Calendar size={13} />
                      {new Date(activeReadArticle.published_at || activeReadArticle.published_date || '').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Subtitle/Excerpt */}
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-l-2 border-blue-600 dark:border-emerald-500 pl-4 font-medium italic">
                  {activeReadArticle.description || activeReadArticle.excerpt}
                </p>

                {/* Main Content Render */}
                <div 
                  className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 prose dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-emerald-400 hover:prose-a:text-blue-500 dark:hover:prose-a:text-emerald-300 font-light"
                  dangerouslySetInnerHTML={{ __html: activeReadArticle.content || '' }}
                />

                {/* Related Articles Section */}
                {(() => {
                  const related = articles
                    .filter(a => a.id !== activeReadArticle.id && (
                      a.category.toLowerCase() === activeReadArticle.category.toLowerCase() ||
                      a.category.toLowerCase().includes(activeReadArticle.category.toLowerCase()) ||
                      activeReadArticle.category.toLowerCase().includes(a.category.toLowerCase())
                    ))
                    .slice(0, 3);

                  // Fallback to fill up to 3 articles
                  const finalRelated = [...related];
                  if (finalRelated.length < 3) {
                    const extras = articles
                      .filter(a => a.id !== activeReadArticle.id && !finalRelated.some(r => r.id === a.id))
                      .slice(0, 3 - finalRelated.length);
                    finalRelated.push(...extras);
                  }

                  if (finalRelated.length === 0) return null;

                  return (
                    <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white font-mono flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-emerald-400" />
                        Related Tech Insights
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {finalRelated.map((relArt) => (
                          <div 
                            key={relArt.id}
                            onClick={() => {
                              setActiveReadArticle(relArt);
                              // Scroll the modal scrollable container back to top
                              const container = document.querySelector('.max-h-\\[calc\\(90vh-11rem\\)\\]');
                              if (container) container.scrollTop = 0;
                            }}
                            className="group/rel cursor-pointer bg-slate-50 dark:bg-slate-950/40 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 border border-slate-200/60 dark:border-slate-800/60 hover:border-blue-400/50 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between h-full space-y-3 shadow-sm hover:shadow-md"
                          >
                            <div className="space-y-2">
                              <span className="inline-block text-[8px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-emerald-400">
                                {relArt.category}
                              </span>
                              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover/rel:text-blue-600 dark:group-hover/rel:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                                {relArt.title}
                              </h4>
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 font-mono">
                              <Clock size={10} />
                              <span>{relArt.read_time || '5 min read'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Bottom Drawer Actions */}
              <div className="p-5 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/50 flex justify-end shrink-0">
                <button
                  onClick={() => setActiveReadArticle(null)}
                  className="px-6 py-2.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-full transition-colors cursor-pointer"
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
