import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Award, GraduationCap, CheckCircle2, 
  ChevronLeft, ChevronRight, TrendingUp, Sparkles, Send, Building 
} from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../services/db';
import { 
  HeroSlide, WebsiteSettings, ServiceItem, InternshipProgram, 
  BlogPost, TestimonialItem, PlacementStat, ClientPartnerLogo 
} from '../types';
import LucideIcon from '../components/LucideIcon';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for a super sleek/smooth easeOut-like curve
    }
  }
};

export default function Home() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [internships, setInternships] = useState<InternshipProgram[]>([]);
  const [placements, setPlacements] = useState<PlacementStat[]>([]);
  const [partners, setPartners] = useState<ClientPartnerLogo[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Statistics counters
  const [stats, setStats] = useState({
    studentsCount: 15340,
    placementRate: 94,
    trainingCount: 420,
    corporateClients: 120
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          slideData, servData, internData, placementData,
          cpData, testData, blogData
        ] = await Promise.all([
          db.getHeroSlides(),
          db.getServices(),
          db.getInternships(),
          db.getPlacementStats(),
          db.getClientPartners(),
          db.getTestimonials(),
          db.getBlogs()
        ]);

        setSlides(slideData);
        setServices(servData.slice(0, 4)); // top 4 featured services
        setInternships(internData.slice(0, 3)); // top 3 internships
        setPlacements(placementData);
        setPartners(cpData);
        setTestimonials(testData.slice(0, 3));
        setBlogs(blogData.slice(0, 2)); // top 2 latest blogs
      } catch (err) {
        console.error('Error fetching landing details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Slide loop timer
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides]);

  const handlePrevSlide = () => {
    setActiveSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setActiveSlide(prev => (prev + 1) % slides.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-emerald-500/10 border-t-emerald-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div id="landing-page-root" className="bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
      
      {/* 1. HERO SLIDER */}
      {slides.length > 0 && (
        <section id="hero-slider" className="relative h-[80vh] md:h-[85vh] w-full overflow-hidden bg-slate-900">
          {slides.map((slide, idx) => (
            <div 
              key={slide.id}
              className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 transform ${
                idx === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              {/* Overlay shading */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-slate-950/80 z-10" />
              <img 
                src={slide.imageUrl} 
                alt={slide.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              {/* Content Card layout */}
              <div className="absolute inset-0 z-20 flex items-center justify-start">
                <motion.div 
                  className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 text-left"
                  initial="hidden"
                  animate={idx === activeSlide ? "visible" : "hidden"}
                  variants={containerVariants}
                >
                  <motion.div 
                    variants={itemVariants}
                    className="inline-flex items-center gap-2.5 bg-blue-500/15 border border-blue-500/30 text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-wider uppercase"
                  >
                    <img src="/logo.png" alt="Zentriya Logo" className="w-5 h-5 object-contain shrink-0" />
                    Zentriya Technical Ecosystem
                  </motion.div>
                  
                  <motion.h1 
                    variants={itemVariants}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none mb-6 max-w-3xl font-display"
                  >
                    {slide.title}
                  </motion.h1>
                  
                  <motion.p 
                    variants={itemVariants}
                    className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 max-w-2xl font-light leading-relaxed"
                  >
                    {slide.subtitle}
                  </motion.p>
                  
                  <motion.div 
                    variants={itemVariants}
                    className="flex flex-wrap gap-4"
                  >
                    <Link 
                      to={slide.ctaLink}
                      className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:brightness-110 text-white text-sm sm:text-base font-bold px-6 py-3 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 hover:scale-105 duration-200"
                    >
                      {slide.ctaText}
                      <ArrowRight size={16} />
                    </Link>
                    <Link 
                      to="/contact"
                      className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white text-sm sm:text-base font-semibold px-6 py-3 rounded-lg backdrop-blur-sm transition-all"
                    >
                      Partner Relations
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          ))}

          {/* Slide navigation controls */}
          {slides.length > 1 && (
            <>
              <button 
                onClick={handlePrevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-lg bg-slate-900/60 hover:bg-emerald-600 hover:text-white text-slate-300 border border-slate-700 transition-colors"
                aria-label="Previous Slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={handleNextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-lg bg-slate-900/60 hover:bg-blue-600 hover:text-white text-slate-300 border border-slate-700 transition-colors"
                aria-label="Next Slide"
              >
                <ChevronRight size={20} />
              </button>
              
              {/* Dot Markers */}
              <div className="absolute bottom-6 left-0 w-full flex justify-center gap-2.5 z-30">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === activeSlide ? 'w-8 bg-blue-500' : 'w-2 bg-slate-600 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* 2. COMPANY INTRODUCTION / OVERVIEW */}
      <section id="company-overview" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-full">
              <TrendingUp size={14} />
              Industry Leader
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight font-display">
              Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">high-traffic code solutions</span> & shaping future architects.
            </h2>
            
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              Zentriya IT Solutions Private Limited bridges the vast divide between cutting-edge custom software development and direct technical enablement. We engineer robust SaaS frameworks, migrate old architectures to serverless cloud configurations, and manage active student internships.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Corporate Code Integrity</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Strict linting, git workflows, and clean database schemas.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Placement Guaranteed Pipelines</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Direct technical hiring pipelines with 120+ software partners.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link 
                to="/about"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:gap-3 transition-all"
              >
                Learn More About Our Journey
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            {/* Visual Glassmorphism Card Frame */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-emerald-500/10 rounded-3xl blur-2xl -z-10" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500/10 rounded-3xl blur-2xl -z-10" />
            
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xl relative p-3">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&h=480&fit=crop&q=80" 
                alt="Zentriya Collaboration Workspace"
                className="rounded-xl w-full object-cover h-[350px]"
                referrerPolicy="no-referrer"
              />
              {/* Floating Stat Badge */}
              <div className="absolute bottom-8 right-8 bg-slate-900/90 text-white px-5 py-4 rounded-xl border border-slate-700 backdrop-blur-md shadow-xl flex items-center gap-3 animate-pulse">
                <Award size={24} className="text-emerald-400" />
                <div>
                  <div className="text-lg font-bold">100% ISO</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Quality Operations Verified</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. ANIMATED STATISTICS */}
      <section id="statistics-banner" className="py-16 bg-gradient-to-r from-slate-900 via-[#0A192F] to-slate-950 text-white relative overflow-hidden border-y border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 text-center">
            
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight font-display">
                {(stats.studentsCount / 1000).toFixed(1)}K+
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-widest font-mono">
                Students Trained Globally
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight font-display">
                {stats.placementRate}%
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-widest font-mono">
                Direct Placement Success
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight font-display">
                {stats.trainingCount}+
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-widest font-mono">
                Enterprise Bootcamps Held
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight font-display">
                {stats.corporateClients}+
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-widest font-mono">
                Corporate Hiring Partners
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. FEATURED SERVICES GRID */}
      {services.length > 0 && (
        <section id="featured-services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-blue-600 dark:text-blue-400 font-bold tracking-widest text-xs uppercase block">
              What We Do
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
              Enterprise Solutions & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Skill Acceleration</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              We deliver elite technical consulting combined with placement-oriented enablement ecosystems. Explore our core engineering domains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {services.map((serv) => (
              <div 
                id={`serv-card-${serv.id}`}
                key={serv.id}
                className="group border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
              >
                {/* Visual hover color bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-gradient-to-tr group-hover:from-blue-600 group-hover:to-emerald-500 group-hover:text-white transition-colors">
                    <LucideIcon name={serv.icon} size={22} />
                  </div>
                  
                  <h3 className="font-bold text-slate-950 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-display">
                    {serv.title}
                  </h3>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {serv.description}
                  </p>
                </div>

                <div className="pt-6">
                  <Link 
                    to="/services"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:gap-2.5 transition-all"
                  >
                    View Domain Services
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. INTERNSHIP HIGHLIGHTS */}
      {internships.length > 0 && (
        <section id="internship-highlights" className="py-20 bg-slate-100 dark:bg-slate-900/40 border-y border-slate-200/50 dark:border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
              <div className="space-y-4 max-w-2xl">
                <span className="text-blue-600 dark:text-blue-400 font-bold tracking-widest text-xs uppercase block">
                  Placement Enablement
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
                  High-Impact <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Internship Tracks</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                  Join our enterprise coding internships. Engineer modular services, commit to active branch repos, receive code reviews, and lock in placement offers.
                </p>
              </div>
              <Link 
                to="/internships"
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 py-3 rounded-lg shadow-lg shadow-blue-500/20 transition-all shrink-0 flex items-center gap-2 hover:scale-105"
              >
                All Internships
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {internships.map((intern) => (
                <div 
                  id={`intern-highlight-${intern.id}`}
                  key={intern.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="h-48 relative overflow-hidden bg-slate-900">
                    <img 
                      src={intern.bannerUrl} 
                      alt={intern.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {intern.mode}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="text-xs text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-2 font-mono">
                      <GraduationCap size={15} className="text-blue-500" />
                      <span>Duration: {intern.duration}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight line-clamp-1 font-display">
                      {intern.title}
                    </h3>

                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {intern.description}
                    </p>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 font-semibold line-through">₹{intern.price}</span>
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400 font-mono">
                          ₹{intern.discountPrice || intern.price}
                        </div>
                      </div>
                      
                      <Link 
                        to="/internships"
                        className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all hover:scale-105"
                      >
                        Enroll Track
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. PLACEMENT HIGHLIGHTS */}
      {placements.length > 0 && (
        <section id="placement-highlights" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-blue-600 dark:text-blue-400 font-bold tracking-widest text-xs uppercase block">
              Recent Placement Records
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
              Honoring Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Selected Alumnae</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Meet our successfully placed interns who transitioned from training modules directly into software products at IBM, Microsoft, and Accenture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {placements.map((stat) => (
              <div 
                id={`placed-alumnus-${stat.id}`}
                key={stat.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all flex items-center gap-4"
              >
                <img 
                  src={stat.studentPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80'} 
                  alt={stat.studentName} 
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500/20"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-950 dark:text-white text-base leading-tight font-display">
                    {stat.studentName}
                  </h4>
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    Placed at {stat.companyName}
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                    CTC Offer: <span className="font-bold text-slate-800 dark:text-slate-300">{stat.packageLPA} LPA</span>
                  </div>
                  <div className="text-[11px] italic text-slate-500">
                    {stat.courseOrInternship}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. CLIENT & PARTNER LOGOS */}
      {partners.length > 0 && (
        <section id="partner-logos" className="py-12 bg-slate-100 dark:bg-slate-900/20 border-y border-slate-200/50 dark:border-slate-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mb-8">
              Recognized and Hired by Enterprise Leaders
            </p>
            <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14">
              {partners.map((cp) => (
                <div key={cp.id} className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex items-center gap-2">
                  <Building className="text-slate-500" size={20} />
                  <span className="font-semibold text-sm text-slate-700 dark:text-slate-300 tracking-tight uppercase">
                    {cp.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. TESTIMONIALS SLIDER SECTION */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-blue-600 dark:text-blue-400 font-bold tracking-widest text-xs uppercase block">
              Success Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
              Testimonials from <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Students & Corporates</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              We focus on building career capability, leading directly to outstanding corporate satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((test) => (
              <div 
                id={`testimonial-${test.id}`}
                key={test.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-lg relative flex flex-col justify-between hover:shadow-2xl hover:scale-[1.02] transition-all"
              >
                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex text-amber-500">
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <span key={i} className="text-base">★</span>
                    ))}
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                    "{test.text}"
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 mt-6 flex items-center gap-3">
                  <img 
                    src={test.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80'} 
                    alt={test.name} 
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/15"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="font-bold text-slate-950 dark:text-white text-sm font-display">
                      {test.name}
                    </h5>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold leading-none mt-1">
                      {test.companyOrCollege}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. LATEST BLOGS & ARTICLES */}
      {blogs.length > 0 && (
        <section id="latest-blogs" className="py-20 bg-slate-100 dark:bg-slate-900/40 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
              <div className="space-y-4">
                <span className="text-blue-600 dark:text-blue-400 font-bold tracking-widest text-xs uppercase block">
                  Tech Insights
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
                  Articles from Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Tech Council</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                  Stay updated with advanced Cloud migrating tricks, serverless cost structures, and secure AI integrations.
                </p>
              </div>
              <Link 
                to="/blog"
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 shrink-0 flex items-center gap-1.5"
              >
                View Tech Feed
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {blogs.map((post) => (
                <div 
                  id={`home-blog-post-${post.id}`}
                  key={post.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col sm:flex-row gap-5 items-start"
                >
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full sm:w-44 h-40 rounded-xl object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-3 flex-1">
                    <span className="text-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider font-mono">
                      {post.category}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight tracking-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-display">
                      <Link to={`/blog`}>{post.title}</Link>
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                      Published: {new Date(post.createdAt).toLocaleDateString()} &bull; Written by {post.author}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. CALL-TO-ACTION SECTION */}
      <section id="cta-action" className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent)]" />
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none font-display">
            Ready to Accelerate Your Enterprise IT Capability?
          </h2>
          <p className="text-slate-100 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            Whether you want custom microservices engineered for your firm, or seek an intensive internship program to unlock your career, Zentriya has a dynamic answer.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link 
              to="/contact"
              className="bg-white text-blue-700 hover:bg-slate-100 font-bold px-6 py-3 rounded-lg text-sm sm:text-base transition-colors shadow-lg"
            >
              Consult with Architects
            </Link>
            <Link 
              to="/internships"
              className="bg-slate-900/40 hover:bg-slate-900/60 border border-white/20 text-white font-bold px-6 py-3 rounded-lg text-sm sm:text-base transition-colors"
            >
              Apply for Internships
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
