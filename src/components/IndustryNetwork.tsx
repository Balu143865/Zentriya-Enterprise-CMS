import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../services/db';
import { IndustryPartner } from '../types';
import { renderPartnerLogo } from '../utils/partnerLogos';

export default function IndustryNetwork() {
  const [partners, setPartners] = useState<IndustryPartner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await db.getIndustryPartners();
        // Filter out inactive partners safely (allow undefined or missing properties as active)
        const activePartners = data
          .filter((partner) => String(partner.is_active) !== 'false')
          .sort((a, b) => a.display_order - b.display_order);
        setPartners(activePartners);
      } catch (error) {
        console.error('Failed to load industry partners:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  if (loading) {
    return (
      <section className="dark py-24 bg-[#0B1220] transition-colors duration-350 ease-in-out">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return null;
  }

  // Duplicate the list multiple times to ensure seamless infinite marquee scrolling
  const duplicatedPartners = [...partners, ...partners, ...partners, ...partners];

  return (
    <section 
      id="industry-network-section"
      className="dark relative py-24 bg-[#0B1220] border-t border-b border-slate-900 overflow-hidden"
    >
      {/* Background Subtle Gradient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Styled JSX for the marquee animation */}
      <style>{`
        @keyframes marquee-scroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-25%, 0, 0);
          }
        }
        .animate-marquee-infinite {
          display: flex;
          gap: 1.5rem; /* gap-6 */
          width: max-content;
          animation: marquee-scroll 35s linear infinite;
        }
        .animate-marquee-infinite:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header Container (Bounded to max-w-7xl) */}
      <div className="max-w-7xl mx-auto px-4 relative z-10 mb-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-4"
          >
            <span className="text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent px-3 py-1 rounded-full bg-slate-950 border border-slate-800 shadow-sm inline-block">
              OUR INDUSTRY NETWORK
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              Trusted by <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">Industry Leaders</span>
            </h2>
            <p className="text-base text-slate-400 leading-relaxed">
              Our training programs are designed based on industry standards and technologies used by leading global companies.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Full-Bleed Carousel Container (Spans edge-to-edge of screen) */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative w-full overflow-hidden py-4"
      >
        {/* Edge fading gradients for enterprise feel */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-48 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-48 bg-gradient-to-l from-[#0B1220] via-[#0B1220]/80 to-transparent z-20 pointer-events-none" />

        {/* Marquee Row */}
        <div className="w-full overflow-hidden">
          <div className="animate-marquee-infinite">
            {duplicatedPartners.map((partner, idx) => {
              // Subtle floating delay based on index for a more natural look
              const floatDelay = (idx % 4) * 0.5;

              return (
                <motion.div
                  key={`${partner.id}-${idx}`}
                  animate={{
                    y: [0, -4, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    delay: floatDelay,
                    ease: "easeInOut"
                  }}
                  className="w-[180px] sm:w-[210px] md:w-[240px] shrink-0"
                >
                  <a 
                    href={partner.website_url || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block group relative h-[120px] sm:h-[135px] md:h-[150px] bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 hover:border-blue-500/40 dark:hover:border-emerald-500/40 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                  >
                    {/* Interactive glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-emerald-500/0 group-hover:from-blue-500/5 group-hover:to-emerald-500/5 transition-all duration-500 opacity-0 group-hover:opacity-100 -z-10" />
                    <div className="absolute -inset-px rounded-2xl border border-transparent group-hover:border-blue-500/30 dark:group-hover:border-emerald-500/30 transition-all duration-300 pointer-events-none" />

                    {/* Logo Frame - Perfectly Centered */}
                    <div className="absolute inset-0 flex items-center justify-center px-6 py-6 pb-9 sm:px-8 sm:py-7 sm:pb-11 group-hover:scale-105 transition-transform duration-300">
                      {renderPartnerLogo(partner, "max-h-full max-w-full object-contain filter dark:brightness-100 transition-all duration-300")}
                    </div>

                    {/* Company Name label at the bottom */}
                    <div className="absolute bottom-2.5 left-0 right-0 px-3 text-center">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-emerald-400 transition-colors duration-300 leading-none block truncate">
                        {partner.company_name}
                      </span>
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>

      </motion.div>
    </section>
  );
}
