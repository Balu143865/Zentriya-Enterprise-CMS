import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { GalleryAlbum, GalleryItem } from '../types';
import { Search, Image, Play, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export default function Gallery() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Lightbox index
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openLightbox = (id: string) => {
    const idx = filteredItems.findIndex(item => item.id === id);
    if (idx >= 0) {
      setLightboxIndex(idx);
    }
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(prev => (prev! - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(prev => (prev! + 1) % filteredItems.length);
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
            Campus Celebrations & Records
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-white font-display">
            Our Interactive Media Gallery
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Review live images of our technical lab layouts, student team hackathons, and global campus recruitment celebration circles.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div 
                id={`gallery-item-wrapper-${item.id}`}
                key={item.id}
                onClick={() => openLightbox(item.id)}
                className="group relative h-64 bg-slate-900 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-200/20 dark:border-slate-800"
              >
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
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
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-sm font-medium">No images matched your filter parameters.</p>
          </div>
        )}

      </div>

      {/* Lightbox Modal Carousel */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          
          {/* Close trigger button */}
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 bg-slate-900/80 hover:bg-blue-600 text-white rounded-lg border border-slate-700 transition-all"
            title="Close Lightbox"
          >
            <X size={20} />
          </button>

          {/* Left Arrow */}
          <button 
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-slate-900/60 hover:bg-blue-600 text-slate-300 rounded-full border border-slate-700 transition-all"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Right Arrow */}
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-slate-900/60 hover:bg-blue-600 text-slate-300 rounded-full border border-slate-700 transition-all"
          >
            <ChevronRight size={22} />
          </button>

          <div className="max-w-4xl w-full flex flex-col items-center gap-4">
            <div className="relative max-h-[75vh] w-full flex items-center justify-center">
              {filteredItems[lightboxIndex].type === 'video' && filteredItems[lightboxIndex].url.includes('youtube') ? (
                <iframe 
                  src={filteredItems[lightboxIndex].url}
                  title={filteredItems[lightboxIndex].title}
                  className="w-full aspect-video max-h-[70vh] rounded-xl shadow-2xl border border-slate-800"
                  allowFullScreen
                />
              ) : (
                <img 
                  src={filteredItems[lightboxIndex].url} 
                  alt={filteredItems[lightboxIndex].title} 
                  className="max-h-[75vh] max-w-full rounded-xl object-contain border border-slate-800 shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {/* Lightbox Information Details */}
            <div className="text-center text-white max-w-lg">
              <span className="text-[10px] bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-2.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">
                {filteredItems[lightboxIndex].category}
              </span>
              <h3 className="font-extrabold text-lg mt-2 tracking-tight">
                {filteredItems[lightboxIndex].title}
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Image {lightboxIndex + 1} of {filteredItems.length}
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
