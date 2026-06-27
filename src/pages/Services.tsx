import { useState, useEffect } from 'react';
import { db } from '../services/db';
import { ServiceItem } from '../types';
import LucideIcon from '../components/LucideIcon';
import { Layers, Image, Eye, X, Send, ArrowLeft, CheckCircle2, Star, Sparkles, MessageSquareCode, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import PremiumServices from '../components/PremiumServices';

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [activeGallery, setActiveGallery] = useState<string[] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    db.getServices().then((data) => {
      // Show active services only (if is_active/isActive is defined, default to active)
      const activeOnly = data.filter(s => s.isActive !== false);
      setServices(activeOnly);
      setLoading(false);

      // Auto-open if query param ?id=service_id matches
      const params = new URLSearchParams(window.location.search);
      const serviceId = params.get('id');
      if (serviceId) {
        const found = activeOnly.find(s => s.id === serviceId);
        if (found) {
          setSelectedService(found);
        }
      }
    });
  }, []);

  const openGallery = (urls: string[]) => {
    if (urls && urls.length > 0) {
      setActiveGallery(urls);
      setLightboxIndex(0);
    }
  };

  const closeGallery = () => {
    setActiveGallery(null);
    setLightboxIndex(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/10 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  // DETAILED SERVICE VIEW
  if (selectedService) {
    return (
      <AnimatePresence mode="wait">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24"
        >
          {/* Hero Banner with Cover Image */}
          <div className="relative h-[280px] sm:h-[400px] bg-slate-950 overflow-hidden flex items-end">
            <img 
              src={selectedService.imageUrl} 
              alt={selectedService.title} 
              className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105 filter blur-[2px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80" />
            
            <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 pb-8 sm:pb-12">
              <button 
                onClick={() => setSelectedService(null)}
                className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-xs bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 transition-all mb-6 group hover:-translate-x-1"
              >
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                Back to Services Brochure
              </button>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                  <LucideIcon name={selectedService.icon} size={28} />
                </div>
                <div>
                  <span className="text-blue-400 font-extrabold tracking-widest text-[9px] uppercase block mb-1">
                    Corporate Profile Services
                  </span>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                    {selectedService.title}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content Column (Detailed description) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850/60 p-6 sm:p-8 rounded-3xl shadow-xs space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-4">
                  <Sparkles className="text-blue-500" size={18} />
                  <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-wider uppercase">
                    Service Overview & Delivery Model
                  </h3>
                </div>
                
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-light whitespace-pre-line">
                  {selectedService.detailedDescription || selectedService.description}
                </p>

                {/* Sub Cover image display */}
                <div className="rounded-2xl overflow-hidden h-48 sm:h-64 border border-slate-200 dark:border-slate-800 shadow-sm mt-4">
                  <img src={selectedService.imageUrl} alt={selectedService.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>

                {selectedService.galleryUrls && selectedService.galleryUrls.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800/60">
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 tracking-wider uppercase">Project Representations</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedService.galleryUrls.map((url, idx) => (
                        <div key={idx} className="group relative rounded-xl overflow-hidden h-32 cursor-pointer border border-slate-100 dark:border-slate-800" onClick={() => openGallery(selectedService.galleryUrls)}>
                          <img src={url} alt={`Representation ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Eye className="text-white" size={18} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (Features, Benefits, CTA) */}
            <div className="space-y-6">
              {/* Features Box */}
              {selectedService.features && selectedService.features.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850/60 p-6 rounded-3xl shadow-xs space-y-4">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white tracking-wider uppercase flex items-center gap-2 border-b border-slate-50 dark:border-slate-850 pb-2">
                    <CheckCircle2 className="text-emerald-500" size={16} />
                    Core Features
                  </h4>
                  <ul className="space-y-3">
                    {selectedService.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-snug">
                        <span className="text-emerald-500 font-extrabold shrink-0 mt-0.5">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits Box */}
              {selectedService.benefits && selectedService.benefits.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850/60 p-6 rounded-3xl shadow-xs space-y-4">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white tracking-wider uppercase flex items-center gap-2 border-b border-slate-50 dark:border-slate-850 pb-2">
                    <Star className="text-blue-500 fill-blue-500/10" size={15} />
                    Corporate Benefits
                  </h4>
                  <ul className="space-y-3">
                    {selectedService.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-snug">
                        <span className="text-blue-500 font-bold shrink-0 mt-0.5">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Box */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-7 rounded-3xl border border-slate-850 shadow-xl space-y-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
                <div className="space-y-2 relative z-10">
                  <h4 className="text-base font-bold">Inquire & Consult</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                    Submit a query regarding our <strong>{selectedService.title}</strong> model, and our technical advisory team will provide detailed consultation timelines and resources.
                  </p>
                </div>
                <Link 
                  to={`/contact?subject=Query on ${encodeURIComponent(selectedService.title)}`}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageSquareCode size={15} />
                  Book A Consult Now
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // BROCHURE DIRECTORY GRID VIEW
  return (
    <div id="services-page-root" className="bg-[#050B14] min-h-screen">
      <PremiumServices 
        services={services} 
        onSelectService={(serv) => setSelectedService(serv)} 
      />

      {/* Dynamic Lightbox for Service Representation */}
      {activeGallery && lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button 
            onClick={closeGallery}
            className="absolute top-6 right-6 p-2 bg-slate-900/80 hover:bg-red-600 text-white rounded-lg border border-slate-800 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="max-w-4xl w-full flex flex-col items-center gap-4">
            <div className="relative max-h-[70vh] w-full flex items-center justify-center">
              <img 
                src={activeGallery[lightboxIndex]} 
                alt="Representation representation" 
                className="max-h-[70vh] max-w-full rounded-xl object-contain border border-slate-800 shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {activeGallery.length > 1 && (
              <div className="flex gap-2">
                {activeGallery.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full ${idx === lightboxIndex ? 'bg-blue-500' : 'bg-slate-600'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
