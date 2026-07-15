import React, { useState, useEffect, useRef } from 'react';
import { db } from '../services/db';
import { GalleryAlbum, GalleryItem } from '../types';
import { Search, Image, Play, X, ChevronLeft, ChevronRight, Eye, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LazyMediaProps {
  type: 'image' | 'video';
  src: string;
  alt: string;
  className?: string;
}

function LazyMedia({ type, src, alt, className }: LazyMediaProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '120px', // Pre-load elements 120px before they enter the viewport
        threshold: 0.01,
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-slate-100 dark:bg-slate-900/40 overflow-hidden">
      {/* High Quality Minimalist Placeholder Shimmer */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900/50 animate-pulse">
          <div className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-800 border-t-blue-500 animate-spin" />
        </div>
      )}
      
      {isInView && (
        type === 'video' ? (
          <video
            src={src}
            muted
            preload="metadata"
            onLoadedData={() => setIsLoaded(true)}
            className={`${className} transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            className={`${className} transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            referrerPolicy="no-referrer"
          />
        )
      )}
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Gallery() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Lightbox index
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') {
        setLightboxIndex(prev => (prev! - 1 + filteredItems.length) % filteredItems.length);
        setZoom(false);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex(prev => (prev! + 1) % filteredItems.length);
        setZoom(false);
      } else if (e.key === 'Escape') {
        setLightboxIndex(null);
        setZoom(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  useEffect(() => {
    const fetchData = async () => {
      const [albumData, itemData] = await Promise.all([
        db.getGalleryAlbums(),
        db.getGalleryItems()
      ]);
      setAlbums(albumData);
      setGalleryItems(itemData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const categories = ['All', ...Array.from(new Set(galleryItems.map(item => item.category)))];

  const openLightbox = (id: string) => {
    const idx = filteredItems.findIndex(item => item.id === id);
    if (idx >= 0) {
      setLightboxIndex(idx);
      setZoom(false);
    }
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setZoom(false);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(prev => (prev! - 1 + filteredItems.length) % filteredItems.length);
      setZoom(false);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(prev => (prev! + 1) % filteredItems.length);
      setZoom(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/10 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div id="gallery-page-root" className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-16 sm:py-20 text-center relative border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent)]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4 animate-fade-in">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-bold tracking-widest text-xs uppercase block">
            6-Day SketchUp Workshop 2026
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-white font-display">
            Interactive Media Gallery
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Review official photos of our 6-Day SketchUp and Landscape Design workshop, interactive computer laboratory sessions, and achievements at Bapatla Engineering College.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        
        {/* Search and Filters Layout */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          
          {/* Category Selector */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat 
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-md shadow-blue-500/10' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input bar */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3.5 py-2 rounded-xl w-full md:w-80">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search images or events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 ring-0 focus:ring-0 text-xs text-slate-850 dark:text-slate-100 outline-none w-full"
            />
          </div>

        </div>

        {/* Gallery Items Grid */}
        {filteredItems.length > 0 ? (
          <motion.div 
            key={`${activeCategory}-${searchQuery}`}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item) => (
              <motion.div 
                id={`gallery-item-wrapper-${item.id}`}
                key={item.id}
                variants={itemVariants}
                onClick={() => openLightbox(item.id)}
                className="group relative h-64 bg-slate-900 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-200/20 dark:border-slate-800"
              >
                {item.type === 'video' && (item.url.includes('youtube') || item.url.includes('youtu.be')) ? (
                  <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Play size={40} className="text-emerald-500" />
                    <span className="text-xs font-mono font-medium">YouTube Video</span>
                  </div>
                ) : (
                  <LazyMedia
                    type={item.type as 'image' | 'video'}
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                
                {/* Visual Overlay Shading */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    {item.type === 'video' ? <Play size={16} fill="white" /> : <Eye size={16} />}
                  </div>
                </div>

                {/* Info Overlay at Bottom */}
                <div className="absolute bottom-0 left-0 w-full p-4.5 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent z-20 text-white">
                  <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-wider font-mono">
                    {item.category}
                  </span>
                  <h4 className="font-bold text-sm tracking-tight mt-1.5 line-clamp-1 font-display">
                    {item.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-sm font-medium">No images matched your filter parameters.</p>
          </div>
        )}

      </div>

      {/* Lightbox Modal Carousel */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeLightbox}
            className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-between p-4 md:p-6 select-none"
          >
            {/* Top Control Bar */}
            <div className="w-full flex items-center justify-between z-[55] px-4 pt-2">
              <div className="text-slate-400 text-xs font-mono">
                Image {lightboxIndex + 1} of {filteredItems.length}
              </div>
              <div className="flex items-center gap-3">
                {filteredItems[lightboxIndex].type !== 'video' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoom(!zoom);
                    }}
                    className="p-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-all flex items-center gap-1.5 text-xs font-bold"
                    title={zoom ? "Zoom Out" : "Zoom In"}
                  >
                    {zoom ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
                    <span className="hidden sm:inline">{zoom ? 'Actual Size' : 'Zoom Detail'}</span>
                  </button>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    closeLightbox();
                  }}
                  className="p-2 bg-slate-900/80 hover:bg-rose-600 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-all"
                  title="Close Lightbox"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Media Content Holder */}
            <div className="flex-1 w-full flex items-center justify-center relative overflow-hidden my-4">
              {/* Left Arrow */}
              <button 
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 z-[55] p-3 bg-slate-900/80 hover:bg-blue-600 text-white rounded-full border border-slate-800 transition-all shadow-xl hover:scale-110 active:scale-95"
                title="Previous Image"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Right Arrow */}
              <button 
                onClick={handleNext}
                className="absolute right-2 sm:right-4 z-[55] p-3 bg-slate-900/80 hover:bg-blue-600 text-white rounded-full border border-slate-800 transition-all shadow-xl hover:scale-110 active:scale-95"
                title="Next Image"
              >
                <ChevronRight size={24} />
              </button>

              {/* Main Media with Scale/Zoom & Motion */}
              <motion.div 
                key={filteredItems[lightboxIndex].id}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-4xl max-h-[60vh] md:max-h-[68vh] w-full flex items-center justify-center relative transition-all duration-300"
              >
                {filteredItems[lightboxIndex].type === 'video' ? (
                  filteredItems[lightboxIndex].url.includes('youtube') || filteredItems[lightboxIndex].url.includes('youtu.be') ? (
                    <iframe 
                      src={filteredItems[lightboxIndex].url}
                      title={filteredItems[lightboxIndex].title}
                      className="w-full aspect-video max-h-[60vh] md:max-h-[68vh] rounded-2xl shadow-2xl border border-slate-800"
                      allowFullScreen
                    />
                  ) : (
                    <video 
                      src={filteredItems[lightboxIndex].url} 
                      controls 
                      autoPlay
                      className="max-h-[60vh] md:max-h-[68vh] max-w-full rounded-xl object-contain border border-slate-800 shadow-2xl"
                    />
                  )
                ) : (
                  <img 
                    src={filteredItems[lightboxIndex].url} 
                    alt={filteredItems[lightboxIndex].title} 
                    className={`max-h-[60vh] md:max-h-[68vh] max-w-full rounded-2xl object-contain border border-slate-800 shadow-2xl transition-transform duration-300 ${
                      zoom ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                    onClick={() => setZoom(!zoom)}
                    referrerPolicy="no-referrer"
                  />
                )}
              </motion.div>
            </div>

            {/* Bottom Details and Thumbnail Strip */}
            <div className="w-full max-w-3xl flex flex-col items-center gap-4 pb-4" onClick={(e) => e.stopPropagation()}>
              
              {/* Lightbox Information Details */}
              <div className="text-center text-white max-w-xl">
                <span className="text-[10px] bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-2.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">
                  {filteredItems[lightboxIndex].category}
                </span>
                <h3 className="font-extrabold text-base md:text-lg mt-1.5 tracking-tight text-slate-100">
                  {filteredItems[lightboxIndex].title}
                </h3>
              </div>

              {/* Scrollable Thumbnail Strip */}
              <div className="flex items-center gap-2 overflow-x-auto py-2 max-w-full no-scrollbar px-4">
                {filteredItems.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setLightboxIndex(idx);
                      setZoom(false);
                    }}
                    className={`relative w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 transition-all border-2 ${
                      idx === lightboxIndex 
                        ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/20' 
                        : 'border-slate-800 hover:border-slate-600 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {item.type === 'video' ? (
                      <div className="w-full h-full bg-slate-950 flex items-center justify-center text-emerald-400">
                        <Play size={10} fill="currentColor" />
                      </div>
                    ) : (
                      <img src={item.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    )}
                  </button>
                ))}
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
