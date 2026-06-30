import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/db';
import { Article, ArticleStatistic } from '../types';
import { 
  BookOpen, Cloud, Cpu, Shield, Layout, Settings, 
  Clock, Calendar, ArrowRight, ChevronLeft, ChevronRight,
  Users, Eye, Download, Star
} from 'lucide-react';
import { motion } from 'motion/react';
import { AnimatedHeader, AnimatedCardContainer, AnimatedCard } from './AnimatedTransitions';

// CountUpStat Component for statistics
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
    <div id={`insight-stat-${label.replace(/\s+/g, '-').toLowerCase()}`} className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl bg-white/90 dark:bg-slate-900/40 backdrop-blur border border-slate-200/80 dark:border-slate-800/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:border-blue-200/60 dark:hover:border-blue-900/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex-1 min-w-[200px] text-center sm:text-left justify-center sm:justify-start">
      <div className={`p-3.5 rounded-xl border ${getBg()} shrink-0 shadow-sm`}>
        {getIcon()}
      </div>
      <div className="space-y-0.5">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {displayVal}{suffix}
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-snug">
          {label}
        </div>
      </div>
    </div>
  );
};

const getCategoryIcon = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case 'all articles': return <BookOpen className="w-3.5 h-3.5" />;
    case 'cloud & devops': return <Cloud className="w-3.5 h-3.5" />;
    case 'ai & machine learning': return <Cpu className="w-3.5 h-3.5" />;
    case 'security': return <Shield className="w-3.5 h-3.5" />;
    case 'architecture': return <Layout className="w-3.5 h-3.5" />;
    case 'engineering': return <Settings className="w-3.5 h-3.5" />;
    default: return <BookOpen className="w-3.5 h-3.5" />;
  }
};

const getCategoryBadgeClass = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('devops') || cat.includes('cloud')) {
    return 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30';
  }
  if (cat.includes('ai') || cat.includes('intelligence') || cat.includes('machine')) {
    return 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-100/50 dark:border-purple-900/30';
  }
  if (cat.includes('security')) {
    return 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-100/50 dark:border-red-900/30';
  }
  if (cat.includes('architecture')) {
    return 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/30';
  }
  return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30';
};

export default function TechInsights() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [articleStats, setArticleStats] = useState<ArticleStatistic[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All Articles');
  const [articleIndex, setArticleIndex] = useState(0);
  const [articleCardsToShow, setArticleCardsToShow] = useState(3);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [articleData, statData] = await Promise.all([
          db.getArticles(),
          db.getArticleStatistics()
        ]);
        setArticles(articleData || []);
        setArticleStats(statData || []);
      } catch (error) {
        console.error('Error fetching Tech Insights data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setArticleCardsToShow(4);
      } else if (window.innerWidth >= 1024) {
        setArticleCardsToShow(3);
      } else if (window.innerWidth >= 640) {
        setArticleCardsToShow(2);
      } else {
        setArticleCardsToShow(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (articles.length === 0) {
    return null;
  }

  const filtered = selectedCategory === 'All Articles'
    ? articles.filter(a => a.is_active)
    : articles.filter(a => a.is_active && (a.category.toLowerCase().includes(selectedCategory.toLowerCase()) || selectedCategory.toLowerCase().includes(a.category.toLowerCase())));

  const maxArticleIndex = Math.max(0, filtered.length - articleCardsToShow);

  const nextArticle = () => {
    setArticleIndex(prev => prev >= maxArticleIndex ? 0 : prev + 1);
  };

  const prevArticle = () => {
    setArticleIndex(prev => prev <= 0 ? maxArticleIndex : prev - 1);
  };

  const tabs = ['All Articles', 'Cloud & DevOps', 'AI & Machine Learning', 'Security', 'Architecture', 'Engineering'];

  return (
    <section id="latest-blogs" className="py-24 bg-gradient-to-b from-blue-50/60 via-slate-50 to-blue-50/40 dark:from-slate-950 dark:via-slate-900/40 dark:to-slate-950 relative overflow-hidden border-t border-b border-blue-100/40 dark:border-slate-900/20">
      {/* Ambient decorative glowing circles */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-400/12 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-indigo-400/10 dark:bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <AnimatedHeader className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-blue-500" />
            <span className="text-blue-600 dark:text-blue-400 font-extrabold tracking-widest text-[11px] uppercase font-mono">
              — TECH INSIGHTS —
            </span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-blue-500" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4 font-display">
            Articles from Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500">Tech Council</span>
          </h2>
          
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl">
            Stay updated with advanced Cloud migration tricks, serverless cost structures, and secure AI integrations.
          </p>
        </AnimatedHeader>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
          <div className="flex flex-wrap items-center gap-2 max-w-full overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {tabs.map((tab) => {
              const isActive = selectedCategory === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setSelectedCategory(tab);
                    setArticleIndex(0);
                  }}
                  className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-extrabold transition-all duration-300 shadow-sm cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-white dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 hover:bg-blue-50/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/40 hover:scale-102 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {getCategoryIcon(tab)}
                  {tab}
                </button>
              );
            })}
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors group self-end md:self-auto shrink-0"
          >
            View Tech Feed
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Articles Carousel Area */}
        {(() => {
          if (filtered.length === 0) {
            return (
              <div className="text-center py-16 bg-white/40 dark:bg-slate-900/20 rounded-[24px] border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400 font-medium">No articles found in this category.</p>
              </div>
            );
          }

          return (
            <div 
              className="relative px-2"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Left / Right floating navigation arrows */}
              {filtered.length > articleCardsToShow && (
                <>
                  <button
                    onClick={prevArticle}
                    className="hidden sm:flex absolute left-[-16px] sm:left-[-24px] md:left-[-32px] top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-xl text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105 active:scale-95 transition-all items-center justify-center cursor-pointer"
                    aria-label="Previous Slide"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    onClick={nextArticle}
                    className="hidden sm:flex absolute right-[-16px] sm:right-[-24px] md:right-[-32px] top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-xl text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105 active:scale-95 transition-all items-center justify-center cursor-pointer"
                    aria-label="Next Slide"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}

              {/* Carousel Window */}
              <div className="overflow-hidden w-full py-4">
                <AnimatedCardContainer 
                  className="flex gap-0 transition-all duration-500 ease-out"
                  style={{
                    transform: `translateX(-${articleIndex * (100 / articleCardsToShow)}%)`,
                    width: '100%'
                  }}
                >
                  {filtered.map((article) => (
                    <AnimatedCard
                      key={article.id}
                      style={{
                        flex: `0 0 ${100 / articleCardsToShow}%`,
                      }}
                      className="px-2.5 shrink-0"
                    >
                      <div
                        id={`home-article-card-${article.id}`}
                        className="group bg-white/80 dark:bg-slate-900/65 backdrop-blur-md rounded-[20px] border border-slate-200/60 dark:border-slate-800/40 shadow-[0_6px_24px_rgb(0,0,0,0.02)] hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200/60 transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full overflow-hidden max-w-[320px] mx-auto w-full"
                      >
                        {/* Card Cover Image */}
                        <div className="relative h-44 w-full overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-950">
                          <img 
                            src={article.cover_image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&fit=crop&q=80"} 
                            alt={article.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          {/* Read Time Badge */}
                          <div className="absolute top-3.5 right-3.5 bg-slate-950/70 backdrop-blur text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <Clock size={10} className="text-blue-400" />
                            {article.read_time_minutes} min read
                          </div>
                        </div>

                        {/* Card Info Content */}
                        <div className="p-4.5 flex-1 flex flex-col justify-between">
                          <div className="flex-1">
                            {/* Category Badge */}
                            <span className={`inline-block text-[8px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2.5 border ${getCategoryBadgeClass(article.category)}`}>
                              {article.category}
                            </span>
                            
                            {/* Title */}
                            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-1.5 font-display">
                              <Link to="/blog">{article.title}</Link>
                            </h3>

                            {/* Excerpt */}
                            <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs line-clamp-3 mb-4 leading-relaxed">
                              {article.excerpt || article.description}
                            </p>
                          </div>

                          {/* Divider line */}
                          <div className="w-full h-px bg-slate-100 dark:bg-slate-800/60 my-3" />

                          {/* Author Row */}
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-2">
                              <img 
                                src={article.author_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80"} 
                                alt={article.author_name} 
                                className="w-8 h-8 rounded-full object-cover border border-slate-100 dark:border-slate-800"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex flex-col text-left">
                                <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                  {article.author_name}
                                </span>
                                <span className="text-[8px] font-semibold text-slate-400 dark:text-slate-500 leading-none mt-0.5">
                                  {article.author_designation}
                                </span>
                              </div>
                            </div>
                            
                            {/* Date Published */}
                            <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-[9px] font-semibold shrink-0 font-mono">
                              <Calendar size={10} />
                              <span>{new Date(article.published_at || article.created_at || '').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AnimatedCard>
                  ))}
                </AnimatedCardContainer>
              </div>

              {/* Pagination Dots */}
              {filtered.length > articleCardsToShow && (
                <div className="flex items-center justify-center gap-1.5 mt-8">
                  {Array.from({ length: maxArticleIndex + 1 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setArticleIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        articleIndex === i 
                          ? 'bg-blue-600 dark:bg-blue-400 w-6' 
                          : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}

            </div>
          );
        })()}

        {/* Bottom Explore CTA Button */}
        <div className="flex justify-center mt-12 relative z-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-slate-950 font-extrabold px-6 py-3 transition-all duration-300 group shadow-sm hover:shadow-lg hover:shadow-blue-500/10 hover:scale-103 text-sm"
          >
            <span>Explore More Articles</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Bottom Premium Stats Bar */}
        {articleStats.length > 0 && (
          <div className="mt-20 border-t border-slate-100 dark:border-slate-800/40 pt-16 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {articleStats.sort((a,b) => (a.display_order ?? 99) - (b.display_order ?? 99)).map((stat) => (
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

      </div>
    </section>
  );
}
