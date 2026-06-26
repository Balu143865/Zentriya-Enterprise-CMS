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
  BlogPost, TestimonialItem, PlacementStat, ClientPartnerLogo,
  WhyChooseUsItem, AboutSection
} from '../types';
import LucideIcon from '../components/LucideIcon';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    }
  }
};

const badgeVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    }
  }
};

const titleContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.045,
    }
  }
};

const titleWordVariants = {
  hidden: { 
    y: "115%", 
    rotate: 3,
    opacity: 0 
  },
  visible: {
    y: 0,
    rotate: 0,
    opacity: 1,
    transition: {
      duration: 0.85,
      ease: [0.215, 0.61, 0.355, 1], // snappy cubic-bezier reveal curve
    }
  }
};

const subtitleContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.015,
    }
  }
};

const subtitleWordVariants = {
  hidden: { 
    y: "100%",
    opacity: 0 
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    }
  }
};

const buttonsVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
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

const getLogoComponent = (name: string, logoUrl?: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes('ibm')) {
    return (
      <svg viewBox="0 0 1075 401.15" className="h-9 w-auto max-w-[110px] text-[#0F62FE] drop-shadow-[0_0_8px_rgba(15,98,254,0.15)]" fill="currentColor">
        <g id="IBM_logo">
          <g id="I">
            <rect y="373.17" width="194.43" height="27.932"/>
            <rect y="319.83" width="194.43" height="27.932"/>
            <rect x="55.468" y="266.54" width="83.399" height="27.932"/>
            <rect x="55.468" y="213.25" width="83.399" height="27.932"/>
            <rect x="55.468" y="159.96" width="83.399" height="27.932"/>
            <rect x="55.468" y="106.58" width="83.399" height="27.932"/>
            <rect y="53.288" width="194.43" height="27.932"/>
            <rect width="194.43" height="27.932"/>
          </g>
          <g id="B">
            <path d="m222.17 400.85 207.11 0.297c27.734 0 52.793-10.697 71.513-27.932h-278.62z"/>
            <path d="m222.17 347.76h299.03c5.051-8.617 8.815-18.027 11.094-27.932h-310.12z"/>
            <rect x="277.73" y="266.54" width="83.3" height="27.932"/>
            <path d="m444.43 266.54v27.932h90.927c0-9.608-1.288-19.017-3.764-27.932z"/>
            <path d="m497.92 213.25h-220.19v27.932h243.46c-6.34-10.698-14.165-20.107-23.277-27.932z"/>
            <path d="m277.73 159.96v27.932h220.19c9.311-7.825 17.135-17.235 23.277-27.932z"/>
            <rect x="277.73" y="106.58" width="83.3" height="27.932"/>
            <path d="m444.43 134.51h87.163c2.476-8.914 3.764-18.324 3.764-27.932h-90.927z"/>
            <path d="m521.2 53.288h-299.03v27.932h310.12c-2.575-9.905-6.339-19.314-11.093-27.932z"/>
            <path d="m429.28 0h-207.11v27.932h278.53c-18.621-17.235-43.878-27.932-71.414-27.932z"/>
          </g>
          <g id="M">
            <polygon points="555.57 81.22 742.67 81.22 733.06 53.288 555.57 53.288"/>
            <polygon points="555.57 27.932 724.25 27.932 714.64 0 555.57 0"/>
            <polygon points="861.03 401.17 861.03 373.24 1e3 373.24 1e3 401.17"/>
            <polygon points="861.03 347.76 861.03 319.83 1e3 319.83 1e3 347.76"/>
            <polygon points="777.73 182.54 769.91 159.96 694.43 159.96 611.03 159.96 611.03 187.89 694.43 187.89 694.43 162.24 703.25 187.89 852.22 187.89 861.03 162.24 861.03 187.89 944.43 187.89 944.43 159.96 861.03 159.96 785.56 159.96"/>
            <polygon points="944.43 106.58 803.98 106.58 794.37 134.51 944.43 134.51"/>
            <polygon points="1e3 27.932 1e3 0 840.93 0 831.32 27.932"/>
            <polygon points="768.13 373.22 777.73 400.85 787.34 373.22"/>
            <polygon points="749.5 319.83 759.31 347.76 796.16 347.76 806.06 319.83"/>
            <polygon points="730.78 266.54 740.59 294.47 814.88 294.47 824.68 266.54"/>
            <polygon points="721.97 241.18 833.6 241.18 843.11 213.25 712.36 213.25"/>
            <polygon points="611.03 134.51 761.09 134.51 751.49 106.58 611.03 106.58"/>
            <polygon points="1e3 53.288 822.4 53.288 812.9 81.22 1e3 81.22"/>
            <rect x="555.57" y="373.22" width="138.97" height="27.932"/>
            <rect x="555.57" y="319.83" width="138.97" height="27.932"/>
            <rect x="611.03" y="266.54" width="83.399" height="27.932"/>
            <rect x="611.03" y="213.25" width="83.399" height="27.932"/>
            <rect x="861.03" y="213.25" width="83.399" height="27.932"/>
            <rect x="861.03" y="266.54" width="83.399" height="27.932"/>
          </g>
          <path id="Registered" d="m1052 357.15a22 22 0 0 0-22 22 22 22 0 0 0 22 22 22 22 0 0 0 22-22 22 22 0 0 0-22-22zm0 4a18 18 0 0 1 18 18 18 18 0 0 1-18 18 18 18 0 0 1-18-18 18 18 0 0 1 18-18zm-9.3476 6.793v22.414h5.453v-7.7305h3.0978l4.164 7.7305h5.9804l-5.0234-8.582c2.4616-0.96446 4.0624-3.2158 4.0624-6.75 0-4.0818-2.5594-7.082-7.582-7.082zm5.453 4.2891h4.0548c1.7114 0 2.668 0.75016 2.668 2.3555v1.6133c0 1.6053-0.9566 2.3594-2.668 2.3594h-4.0548z"/>
        </g>
      </svg>
    );
  }
  if (normalized.includes('aws') || normalized.includes('amazon')) {
    return (
      <svg viewBox="0 0 304 182" className="h-9 w-auto max-w-[90px]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
          <path fill="white" d="M86.4,66.4c0,3.7,0.4,6.7,1.1,8.9c0.8,2.2,1.8,4.6,3.2,7.2c0.5,0.8,0.7,1.6,0.7,2.3c0,1-0.6,2-1.9,3l-6.3,4.2
            c-0.9,0.6-1.8,0.9-2.6,0.9c-1,0-2-0.5-3-1.4C76.2,90,75,88.4,74,86.8c-1-1.7-2-3.6-3.1-5.9c-7.8,9.2-17.6,13.8-29.4,13.8
            c-8.4,0-15.1-2.4-20-7.2c-4.9-4.8-7.4-11.2-7.4-19.2c0-8.5,3-15.4,9.1-20.6c6.1-5.2,14.2-7.8,24.5-7.8c3.4,0,6.9,0.3,10.6,0.8
            c3.7,0.5,7.5,1.3,11.5,2.2v-7.3c0-7.6-1.6-12.9-4.7-16c-3.2-3.1-8.6-4.6-16.3-4.6c-3.5,0-7.1,0.4-10.8,1.3c-3.7,0.9-7.3,2-10.8,3.4
            c-1.6,0.7-2.8,1.1-3.5,1.3c-0.7,0.2-1.2,0.3-1.6,0.3c-1.4,0-2.1-1-2.1-3.1v-4.9c0-1.6,0.2-2.8,0.7-3.5c0.5-0.7,1.4-1.4,2.8-2.1
            c3.5-1.8,7.7-3.3,12.6-4.5c4.9-1.3,10.1-1.9,15.6-1.9c11.9,0,20.6,2.7,26.2,8.1c5.5,5.4,8.3,13.6,8.3,24.6V66.4z M45.8,81.6
            c3.3,0,6.7-0.6,10.3-1.8c3.6-1.2,6.8-3.4,9.5-6.4c1.6-1.9,2.8-4,3.4-6.4c0.6-2.4,1-5.3,1-8.7v-4.2c-2.9-0.7-6-1.3-9.2-1.7
            c-3.2-0.4-6.3-0.6-9.4-0.6c-6.7,0-11.6,1.3-14.9,4c-3.3,2.7-4.9,6.5-4.9,11.5c0,4.7,1.2,8.2,3.7,10.6
            C37.7,80.4,41.2,81.6,45.8,81.6z M126.1,92.4c-1.8,0-3-0.3-3.8-1c-0.8-0.6-1.5-2-2.1-3.9L96.7,10.2c-0.6-2-0.9-3.3-0.9-4
            c0-1.6,0.8-2.5,2.4-2.5h9.8c1.9,0,3.2,0.3,3.9,1c0.8,0.6,1.4,2,2,3.9l16.8,66.2l15.6-66.2c0.5-2,1.1-3.3,1.9-3.9c0.8-0.6,2.2-1,4-1
            h8c1.9,0,3.2,0.3,4,1c0.8,0.6,1.5,2,1.9,3.9l15.8,67l17.3-67c0.6-2,1.3-3.3,2-3.9c0.8-0.6,2.1-1,3.9-1h9.3c1.6,0,2.5,0.8,2.5,2.5
            c0,0.5-0.1,1-0.2,1.6c-0.1,0.6-0.3,1.4-0.7,2.5l-24.1,77.3c-0.6,2-1.3,3.3-2.1,3.9c-0.8,0.6-2.1,1-3.8,1h-8.6c-1.9,0-3.2-0.3-4-1
            c-0.8-0.7-1.5-2-1.9-4L156,23l-15.4,64.4c-0.5,2-1.1,3.3-1.9,4c-0.8,0.7-2.2,1-4,1H126.1z M254.6,95.1c-5.2,0-10.4-0.6-15.4-1.8
            c-5-1.2-8.9-2.5-11.5-4c-1.6-0.9-2.7-1.9-3.1-2.8c-0.4-0.9-0.6-1.9-0.6-2.8v-5.1c0-2.1,0.8-3.1,2.3-3.1c0.6,0,1.2,0.1,1.8,0.3
            c0.6,0.2,1.5,0.6,2.5,1c3.4,1.5,7.1,2.7,11,3.5c4,0.8,7.9,1.2,11.9,1.2c6.3,0,11.2-1.1,14.6-3.3c3.4-2.2,5.2-5.4,5.2-9.5
            c0-2.8-0.9-5.1-2.7-7c-1.8-1.9-5.2-3.6-10.1-5.2L246,52c-7.3-2.3-12.7-5.7-16-10.2c-3.3-4.4-5-9.3-5-14.5c0-4.2,0.9-7.9,2.7-11.1
            c1.8-3.2,4.2-6,7.2-8.2c3-2.3,6.4-4,10.4-5.2c4-1.2,8.2-1.7,12.6-1.7c2.2,0,4.5,0.1,6.7,0.4c2.3,0.3,4.4,0.7,6.5,1.1
            c2,0.5,3.9,1,5.7,1.6c1.8,0.6,3.2,1.2,4.2,1.8c1.4,0.8,2.4,1.6,3,2.5c0.6,0.8,0.9,1.9,0.9,3.3v4.7c0,2.1-0.8,3.2-2.3,3.2
            c-0.8,0-2.1-0.4-3.8-1.2c-5.7-2.6-12.1-3.9-19.2-3.9c-5.7,0-10.2,0.9-13.3,2.8c-3.1,1.9-4.7,4.8-4.7,8.9c0,2.8,1,5.2,3,7.1
            c2,1.9,5.7,3.8,11,5.5l14.2,4.5c7.2,2.3,12.4,5.5,15.5,9.6c3.1,4.1,4.6,8.8,4.6,14c0,4.3-0.9,8.2-2.6,11.6
            c-1.8,3.4-4.2,6.4-7.3,8.8c-3.1,2.5-6.8,4.3-11.1,5.6C264.4,94.4,259.7,95.1,254.6,95.1z"/>
          <g>
            <path fill="#FF9900" d="M273.5,143.7c-32.9,24.3-80.7,37.2-121.8,37.2c-57.6,0-109.5-21.3-148.7-56.7c-3.1-2.8-0.3-6.6,3.4-4.4
              c42.4,24.6,94.7,39.5,148.8,39.5c36.5,0,76.6-7.6,113.5-23.2C274.2,133.6,278.9,139.7,273.5,143.7z"/>
            <path fill="#FF9900" d="M287.2,128.1c-4.2-5.4-27.8-2.6-38.5-1.3c-3.2,0.4-3.7-2.4-0.8-4.5c18.8-13.2,49.7-9.4,53.3-5
              c3.6,4.5-1,35.4-18.6,50.2c-2.7,2.3-5.3,1.1-4.1-1.9C282.5,155.7,291.4,133.4,287.2,128.1z"/>
          </g>
        </g>
      </svg>
    );
  }
  if (normalized.includes('infosys')) {
    return (
      <svg viewBox="0 0 250 80" className="h-9 w-auto max-w-[110px]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="5" y="58" fill="#007CC3" className="font-sans font-extrabold text-[44px] tracking-[-0.07em]" style={{ fontStyle: 'italic', letterSpacing: '-2px' }}>
          Infosys
        </text>
        <text x="148" y="32" fill="#007CC3" className="font-sans text-[12px] font-bold">®</text>
      </svg>
    );
  }
  if (normalized.includes('cognizant')) {
    return (
      <svg viewBox="0 0 340 80" className="h-9 w-auto max-w-[140px]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(0, 12)">
          <path d="M28 2 L52 14 L52 42 L28 30 Z" fill="url(#cogGrad1)" />
          <path d="M28 30 L52 42 L28 54 L4 42 Z" fill="url(#cogGrad2)" />
          <path d="M4 42 L28 30 L28 2 L4 14 Z" fill="url(#cogGrad3)" />
          <defs>
            <linearGradient id="cogGrad1" x1="28" y1="2" x2="52" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#0055FF" />
            </linearGradient>
            <linearGradient id="cogGrad2" x1="28" y1="30" x2="28" y2="54" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00D4FF" />
              <stop offset="100%" stopColor="#091E42" />
            </linearGradient>
            <linearGradient id="cogGrad3" x1="4" y1="14" x2="28" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3000FF" />
              <stop offset="100%" stopColor="#00E5FF" />
            </linearGradient>
          </defs>
        </g>
        <text x="68" y="52" fill="white" className="font-sans text-[36px] font-medium tracking-tight" style={{ letterSpacing: '-0.5px' }}>
          cognizant
        </text>
        <text x="238" y="28" fill="white" className="font-sans text-[10px]">®</text>
      </svg>
    );
  }
  
  // Custom styled fallback logo for other clients
  if (logoUrl && logoUrl.startsWith('http')) {
    return (
      <img src={logoUrl} alt={name} className="h-9 w-auto object-contain max-h-11 max-w-[130px] filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
    );
  }

  return (
    <div className="flex items-center gap-2 text-slate-400 group-hover:text-white transition-colors">
      <Building size={18} className="text-slate-500 shrink-0" />
      <span className="font-bold tracking-tight text-xs font-sans uppercase">{name}</span>
    </div>
  );
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
  const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUsItem[]>([]);
  const [whyChooseUsTitle, setWhyChooseUsTitle] = useState('Why Choose Us?');
  const [about, setAbout] = useState<AboutSection | null>(null);
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
          cpData, testData, blogData, whyChooseData, settingsData,
          aboutData
        ] = await Promise.all([
          db.getHeroSlides(),
          db.getServices(),
          db.getInternships(),
          db.getPlacementStats(),
          db.getClientPartners(),
          db.getTestimonials(),
          db.getBlogs(),
          db.getWhyChooseUs(),
          db.getSettings(),
          db.getAbout()
        ]);

        setSlides(slideData);
        setServices(servData.slice(0, 4)); // top 4 featured services
        setInternships(internData.slice(0, 3)); // top 3 internships
        setPlacements(placementData);
        setPartners(cpData);
        setTestimonials(testData.slice(0, 3));
        setBlogs(blogData.slice(0, 2)); // top 2 latest blogs
        setWhyChooseUs(whyChooseData.filter(item => item.is_active));
        setWhyChooseUsTitle(settingsData.whyChooseUsTitle || 'Why Choose Us?');
        setAbout(aboutData);
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
                    variants={badgeVariants}
                    className="inline-flex items-center gap-2.5 bg-blue-500/15 border border-blue-500/30 text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-wider uppercase"
                  >
                    <img src="/logo.png" alt="Zentriya Logo" className="w-5 h-5 object-contain shrink-0" />
                    Zentriya Technical Ecosystem
                  </motion.div>
                  
                  <motion.h1 
                    variants={titleContainerVariants}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6 max-w-3xl font-display flex flex-wrap"
                  >
                    {slide.title.split(' ').map((word, wordIdx) => (
                      <span key={wordIdx} className="inline-block overflow-hidden mr-[0.25em] py-1">
                        <motion.span
                          variants={titleWordVariants}
                          className="inline-block origin-left"
                        >
                          {word}
                        </motion.span>
                      </span>
                    ))}
                  </motion.h1>
                  
                  <motion.p 
                    variants={subtitleContainerVariants}
                    className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 max-w-2xl font-light leading-relaxed flex flex-wrap"
                  >
                    {slide.subtitle.split(' ').map((word, wordIdx) => (
                      <span key={wordIdx} className="inline-block overflow-hidden mr-[0.22em] py-0.5">
                        <motion.span
                          variants={subtitleWordVariants}
                          className="inline-block"
                        >
                          {word}
                        </motion.span>
                      </span>
                    ))}
                  </motion.p>
                  
                  <motion.div 
                    variants={buttonsVariants}
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

      {/* 2. ABOUT US PREVIEW SECTION */}
      {about && about.is_active && (
        <section id="about-us-preview" className="py-20 relative bg-slate-50 dark:bg-slate-950 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-emerald-500/5 dark:bg-emerald-500/2 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 dark:bg-blue-500/2 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
            >
              {/* Left Side */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="h-[2px] w-8 bg-[#059669] dark:bg-emerald-400 rounded-full" />
                  <h2 className="text-sm font-bold tracking-widest text-[#059669] dark:text-emerald-400 font-mono uppercase">
                    {about.title}
                  </h2>
                  <span className="h-[2px] w-8 bg-[#059669] dark:bg-emerald-400 rounded-full" />
                </div>

                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight font-display">
                  Transforming Education <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#059669] to-blue-600">Into Employability</span>
                </h3>

                <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed text-justify whitespace-pre-line">
                  {(about.description || '').split('\n\n').slice(0, 2).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                <div className="pt-4">
                  <Link 
                    to="/about"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#059669] to-emerald-500 hover:from-emerald-600 hover:to-emerald-500 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    Read More
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Right Side */}
              <div className="lg:col-span-5 relative">
                <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 rounded-3xl blur-xl opacity-70" />
                <div className="relative border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-3 rounded-3xl shadow-2xl overflow-hidden group">
                  <img 
                    src={about.image} 
                    alt={about.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-[320px] sm:h-[400px] object-cover rounded-2xl group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  />
                  <div className="absolute bottom-6 left-6 bg-slate-950/80 backdrop-blur-md border border-slate-700/50 text-white p-4 rounded-2xl shadow-lg flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Award size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono tracking-wider text-emerald-400 font-bold uppercase">ISO Certified</p>
                      <p className="text-xs font-bold">Academic-Industry Alliance</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

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

      {/* WHY CHOOSE US SECTION */}
      {whyChooseUs.length > 0 && (
        <section id="why-choose-us" className="py-24 bg-slate-50 dark:bg-slate-950/20 border-b border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-emerald-500/5 to-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          {/* SVG Definition for Card Border Gradient */}
          <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
            <defs>
              <linearGradient id="why-choose-us-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold tracking-widest text-xs uppercase block font-mono">
                Corporate Distinction
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
                {whyChooseUsTitle}
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-blue-600 mx-auto rounded-full" />
            </div>

            {/* Features Grid */}
            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15
                  }
                }
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {whyChooseUs.map((item) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-md hover:shadow-2xl hover:-translate-y-2 hover:border-transparent dark:hover:border-transparent transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden"
                >
                  {/* Subtle top indicator bar */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  
                  {/* SVG glowing rotating border sweep */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl" fill="none">
                    <motion.rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      rx="16"
                      ry="16"
                      stroke="url(#why-choose-us-gradient)"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                      initial={{ strokeDasharray: "150 450", strokeDashoffset: 0, opacity: 0 }}
                      whileHover={{ 
                        strokeDashoffset: -600, 
                        opacity: 1,
                        transition: {
                          strokeDashoffset: { repeat: Infinity, duration: 4, ease: "linear" },
                          opacity: { duration: 0.3 }
                        }
                      }}
                    />
                  </svg>

                  {/* Inner background hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.02] to-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Circular Icon Container */}
                  <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center mb-6 border border-slate-200/80 dark:border-slate-800/80 group-hover:border-emerald-500/30 group-hover:bg-gradient-to-tr group-hover:from-blue-500/10 group-hover:to-emerald-500/10 transition-all duration-300 shrink-0 shadow-inner relative z-10">
                    <div className="text-blue-600 dark:text-blue-400 group-hover:text-emerald-500 group-hover:scale-110 transition-all duration-300">
                      <LucideIcon name={item.icon} size={32} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white leading-relaxed font-display relative z-10">
                    {item.title}
                  </h3>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

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
        <section id="partner-logos" className="py-16 bg-[#030712] border-y border-slate-900 relative overflow-hidden">
          {/* Subtle grid accent background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
          
          {/* Global SVG definitions for card glow paths */}
          <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
            <defs>
              <linearGradient id="emerald-blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="50%" stopColor="#00E5FF" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header with horizontal green lines and circle dots */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center gap-4 mb-14"
            >
              <div className="hidden sm:flex items-center gap-1 shrink-0">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: 96 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="h-[2px] bg-[#059669] dark:bg-emerald-500 rounded-full" 
                />
                <div className="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-emerald-500 animate-pulse" />
              </div>
              
              <p className="text-center text-[10px] sm:text-[11px] text-slate-300 uppercase tracking-[0.25em] font-extrabold font-mono px-2">
                RECOGNIZED AND HIRED BY ENTERPRISE LEADERS
              </p>

              <div className="hidden sm:flex items-center gap-1 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-emerald-500 animate-pulse" />
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: 96 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="h-[2px] bg-[#059669] dark:bg-emerald-500 rounded-full" 
                />
              </div>
            </motion.div>

            {/* Grid layout with thin vertical dividers & staggered child entry */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-10 sm:gap-y-12 md:gap-y-0 md:divide-x md:divide-slate-800/50 items-center justify-center"
            >
              {partners.map((cp) => (
                <motion.div 
                  key={cp.id} 
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                    }
                  }}
                  whileHover={{ 
                    y: -4,
                    backgroundColor: "rgba(15, 23, 42, 0.45)",
                    boxShadow: "0 12px 30px -10px rgba(5, 150, 105, 0.12)"
                  }}
                  className="flex flex-col items-center justify-center py-8 px-4 space-y-6 group rounded-2xl transition-all duration-300 relative overflow-hidden cursor-pointer"
                >
                  {/* Glowing background card element */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-500/0 group-hover:to-emerald-500/5 transition-all duration-300 -z-10" />
                  
                  {/* SVG glowing rotating border sweep */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl" fill="none">
                    <motion.rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      rx="16"
                      ry="16"
                      stroke="url(#emerald-blue-gradient)"
                      strokeWidth="1.5"
                      vectorEffect="non-scaling-stroke"
                      initial={{ strokeDasharray: "100 300", strokeDashoffset: 0, opacity: 0 }}
                      whileHover={{ 
                        strokeDashoffset: -400, 
                        opacity: 1,
                        transition: {
                          strokeDashoffset: { repeat: Infinity, duration: 3, ease: "linear" },
                          opacity: { duration: 0.25 }
                        }
                      }}
                    />
                  </svg>

                  {/* Logo Container with hover animation */}
                  <div className="h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    {getLogoComponent(cp.name, cp.logoUrl)}
                  </div>
                  {/* Subtitle / Caption */}
                  <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] text-slate-400 group-hover:text-emerald-400 transition-colors uppercase font-mono text-center">
                    {cp.name}
                  </p>
                </motion.div>
              ))}
            </motion.div>
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
