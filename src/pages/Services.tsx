import { useState, useEffect } from 'react';
import { db } from '../services/db';
import { ServiceItem } from '../types';
import LucideIcon from '../components/LucideIcon';
import { Layers, Image, Eye, X, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGallery, setActiveGallery] = useState<string[] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    db.getServices().then((data) => {
      setServices(data);
      setLoading(false);
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

  return (
    <div id="services-page-root" className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
      
      {/* Header banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-16 sm:py-20 text-center relative border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent)]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4 animate-fade-in">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-bold tracking-widest text-xs uppercase block">
            Technology Sectors & Capability
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-white font-display">
            Custom Software Consulting & Training Solutions
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            We architect robust microservices, provision highly isolated Kubernetes partitions, compile serverless routers, and lead placement bootcamps.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-16">
        
        {/* Services List Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((serv) => (
            <div 
              id={`service-item-card-${serv.id}`}
              key={serv.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-6">
                
                {/* Header Image */}
                <div className="h-48 bg-slate-900 relative overflow-hidden group">
                  <img 
                    src={serv.imageUrl} 
                    alt={serv.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-950/20" />
                </div>

                <div className="px-6 space-y-3">
                  
                  {/* Icon Block */}
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <LucideIcon name={serv.icon} size={20} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight font-display">
                    {serv.title}
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {serv.description}
                  </p>

                </div>

              </div>

              {/* Footer Actions */}
              <div className="px-6 pb-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-6 flex items-center justify-between gap-2">
                
                {serv.galleryUrls && serv.galleryUrls.length > 0 ? (
                  <button 
                    onClick={() => openGallery(serv.galleryUrls)}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-emerald-500"
                  >
                    <Image size={14} />
                    View Gallery ({serv.galleryUrls.length})
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest flex items-center gap-1.5">
                    <Layers size={11} />
                    Verified Service
                  </span>
                )}

                <Link 
                  to="/contact" 
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 transition-all"
                >
                  Inquire
                  <Send size={11} />
                </Link>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Dynamic Lightbox for Service Gallery */}
      {activeGallery && lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button 
            onClick={closeGallery}
            className="absolute top-6 right-6 p-2 bg-slate-900/80 hover:bg-blue-600 text-white rounded-lg border border-slate-700 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="max-w-4xl w-full flex flex-col items-center gap-4">
            <div className="relative max-h-[70vh] w-full flex items-center justify-center">
              <img 
                src={activeGallery[lightboxIndex]} 
                alt="Service Representation" 
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
