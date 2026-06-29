import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Award, GraduationCap, CheckCircle2, 
  ChevronLeft, ChevronRight, TrendingUp, Sparkles, Send, Building,
  Trophy, Users, ShieldCheck, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../services/db';
import { 
  HeroSlide, WebsiteSettings, ServiceItem, InternshipProgram, CourseItem,
  BlogPost, TestimonialItem, PlacementStat, Placement, ClientPartnerLogo,
  WhyChooseUsItem, AboutSection
} from '../types';
import LucideIcon from '../components/LucideIcon';
import PremiumServices from '../components/PremiumServices';
import StudentJourney from '../components/StudentJourney';
import IndustryNetwork from '../components/IndustryNetwork';
import CompanyLogo from '../components/CompanyLogo';
import { PremiumCourseCard, FloatingParticles } from './Courses';

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

// Animated Counter component with intersection observer triggering
function AnimatedCounter({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const elementRef = React.useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setTriggered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!triggered) return;
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMiliseconds = duration;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 16);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration, triggered]);

  return <span ref={elementRef}>{count.toLocaleString()}</span>;
}

const getCardAccent = (globalIdx: number) => {
  const accents = [
    {
      // Card 1: Blue
      borderClass: "border-blue-100/80 dark:border-blue-900/40 hover:border-blue-500/50 hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5",
      quoteColor: "text-blue-300/60 dark:text-blue-800/40",
      designationClass: "text-blue-600 dark:text-blue-400",
      badgeClass: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
      starColor: "text-amber-400"
    },
    {
      // Card 2: Green
      borderClass: "border-emerald-100/80 dark:border-emerald-900/40 hover:border-emerald-500/50 hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/5",
      quoteColor: "text-emerald-300/60 dark:text-emerald-800/40",
      designationClass: "text-emerald-600 dark:text-emerald-400",
      badgeClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20",
      starColor: "text-amber-400"
    },
    {
      // Card 3: Purple
      borderClass: "border-purple-100/80 dark:border-purple-900/40 hover:border-purple-500/50 hover:shadow-purple-500/10 dark:hover:shadow-purple-500/5",
      quoteColor: "text-purple-300/60 dark:text-purple-800/40",
      designationClass: "text-purple-600 dark:text-purple-400",
      badgeClass: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border-purple-100 dark:border-purple-500/20",
      starColor: "text-amber-400"
    }
  ];
  return accents[globalIdx % accents.length];
};

export default function Home() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [internships, setInternships] = useState<InternshipProgram[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [partners, setPartners] = useState<ClientPartnerLogo[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUsItem[]>([]);
  const [whyChooseUsTitle, setWhyChooseUsTitle] = useState('Why Choose Us?');
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [expandedSyllabus, setExpandedSyllabus] = useState<string | null>(null);
  const toggleSyllabus = (id: string) => {
    setExpandedSyllabus(prev => (prev === id ? null : id));
  };
  const [about, setAbout] = useState<AboutSection | null>(null);
  const [loading, setLoading] = useState(true);

  // Custom Testimonials Carousel States
  const [testIndex, setTestIndex] = useState(0);
  const [testHovered, setTestHovered] = useState(false);
  const [testCardsToShow, setTestCardsToShow] = useState(3);
  const [expandedTestimonials, setExpandedTestimonials] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setTestCardsToShow(3);
      } else if (window.innerWidth >= 768) {
        setTestCardsToShow(2);
      } else {
        setTestCardsToShow(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (testHovered || testimonials.length === 0) return;
    const interval = setInterval(() => {
      setTestIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testHovered, testimonials.length]);

  // Statistics counters
  const [stats, setStats] = useState({
    studentsCount: 15340,
    placementRate: 94,
    trainingCount: 420,
    corporateClients: 120
  });

  // Carousel State Variables
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(3);

  // Responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setCardsToShow(3);
      else if (window.innerWidth >= 768) setCardsToShow(2);
      else setCardsToShow(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Autoplay functionality: slide every 5 seconds
  useEffect(() => {
    if (isHovered || placements.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => {
        const maxIndex = Math.max(0, placements.length - cardsToShow);
        if (maxIndex === 0) return 0;
        return (prev + 1) > maxIndex ? 0 : prev + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, placements.length, cardsToShow]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          slideData, servData, internData, placementData,
          cpData, testData, blogData, whyChooseData, settingsData,
          aboutData, courseData
        ] = await Promise.all([
          db.getHeroSlides(),
          db.getServices(),
          db.getInternships(),
          db.getPlacements(),
          db.getClientPartners(),
          db.getTestimonials(),
          db.getBlogs(),
          db.getWhyChooseUs(),
          db.getSettings(),
          db.getAbout(),
          db.getCourses()
        ]);

        setSlides(slideData);
        setServices(servData.filter(s => s.isActive !== false)); // load all active services
        setInternships(internData.slice(0, 3)); // top 3 internships
        setCourses(courseData.filter(c => c.isActive).slice(0, 3)); // top 3 premium courses
        const activePlacements = (placementData || [])
          .filter(p => p.is_active !== false)
          .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
        setPlacements(activePlacements);
        setPartners(cpData);
        const sortedTestimonials = (testData || [])
          .filter(t => t.is_active !== false)
          .sort((a, b) => (a.display_order ?? 99) - (b.display_order ?? 99));
        setTestimonials(sortedTestimonials.length > 0 ? sortedTestimonials : testData);
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
        <PremiumServices services={services} />
      )}

      {/* STUDENT SUCCESS JOURNEY */}
      <StudentJourney />

      {/* PREMIUM FUTURISTIC COURSES SECTION */}
      {courses.length > 0 && (
        <section id="featured-courses" className="bg-[#040812] py-24 border-y border-slate-900 text-slate-100 relative overflow-hidden">
          {/* Mesh/Grid Background lines and radial light vectors */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none select-none z-0" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,rgba(16,185,129,0.03)_50%,transparent_100%)] pointer-events-none select-none z-0" />
          
          {/* Background ambient glow points */}
          <div className="absolute top-[20%] left-1/4 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none z-0" />
          <div className="absolute bottom-[20%] right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[110px] pointer-events-none z-0" />

          {/* Floating stars/particles system */}
          <FloatingParticles />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-5">
              {/* SMALL LABEL: OUR PROGRAMS with tech dots and accent lines */}
              <div className="flex items-center justify-center gap-4 text-emerald-400 font-mono text-xs font-black tracking-[0.25em] uppercase select-none">
                <span className="flex items-center gap-1.5 opacity-80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-emerald-400" />
                </span>
                OUR PROGRAMS
                <span className="flex items-center gap-1.5 opacity-80">
                  <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-emerald-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </span>
              </div>

              {/* MAIN HEADING */}
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white font-display">
                Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.2)]">Premium</span> Courses
              </h2>

              {/* SUBTITLE */}
              <p className="text-slate-400 text-xs sm:text-base font-light leading-relaxed">
                Industry-relevant training programs designed to transform your career.
              </p>

              {/* Green Divider Lines */}
              <div className="flex justify-center items-center gap-2 pt-2">
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-emerald-500/50" />
                <div className="w-2 h-2 rounded-full border border-emerald-500/50" />
                <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-emerald-500/50" />
              </div>
            </div>

            {/* Courses Cards Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <PremiumCourseCard 
                  key={course.id}
                  course={course}
                  expandedSyllabus={expandedSyllabus}
                  toggleSyllabus={toggleSyllabus}
                />
              ))}
            </div>

            {/* Bottom CTA with curved dotted arrows */}
            <div className="relative flex flex-col sm:flex-row justify-center items-center py-16 gap-6 select-none">
              {/* Left dotted curve pointing to the CTA */}
              <div className="absolute right-[56%] bottom-[45%] w-64 h-24 pointer-events-none hidden lg:block opacity-65">
                <svg className="w-full h-full text-emerald-500/30" viewBox="0 0 200 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M 10 10 Q 90 75 185 30" strokeDasharray="5 7" />
                  <polygon points="185,30 173,28 179,38" fill="currentColor" />
                </svg>
              </div>

              {/* View All Courses Button with glow effect */}
              <Link
                to="/courses"
                className="relative px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 text-white font-extrabold text-xs sm:text-sm tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(59,130,246,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 group z-10"
              >
                <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="flex items-center gap-2">
                  View All Courses <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>

              {/* Right dotted curve pointing to the CTA */}
              <div className="absolute left-[56%] bottom-[45%] w-64 h-24 pointer-events-none hidden lg:block opacity-65">
                <svg className="w-full h-full text-blue-500/30" viewBox="0 0 200 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M 190 10 Q 110 75 15 30" strokeDasharray="5 7" />
                  <polygon points="15,30 27,38 21,28" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>
        </section>
      )}



      {/* 6. PLACEMENT HIGHLIGHTS */}
      {placements.length > 0 && (
        <motion.section 
          id="placement-highlights" 
          className="relative py-28 overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-[#080d1a] dark:to-[#0c1328] transition-colors duration-300 border-t border-b border-slate-100 dark:border-slate-900/40"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Decorative ambient background lights */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-xs font-black tracking-widest text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1.5 rounded-full inline-block">
                RECENT PLACEMENT RECORDS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
                Honoring Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-400">Placed Students</span>
              </h2>
              
              {/* Elegant gradient divider lines below centered heading */}
              <div className="flex items-center justify-center gap-3 py-2">
                <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-400 animate-pulse" />
                <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-emerald-400 rounded-full" />
              </div>

              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                Meet our talented students who have successfully transitioned from classroom learning to top-tier companies.
              </p>
            </div>

            {/* Carousel Slider Controls Container */}
            <div className="relative group/slider px-2">
              
              {/* Left Arrow Button */}
              <button
                onClick={() => {
                  setCarouselIndex((prev) => {
                    const maxIndex = Math.max(0, placements.length - cardsToShow);
                    return prev === 0 ? maxIndex : prev - 1;
                  });
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 lg:-translate-x-6 z-20 w-11 h-11 rounded-full flex items-center justify-center bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-800 shadow-lg hover:scale-110 active:scale-95 hover:bg-gradient-to-tr hover:from-blue-600 hover:to-emerald-500 hover:text-white transition-all duration-300 cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Slider Viewport Container */}
              <div className="overflow-hidden py-4 px-1">
                {/* Sliding Track */}
                <motion.div 
                  className="flex"
                  animate={{ x: `-${carouselIndex * (100 / placements.length)}%` }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                  style={{ 
                    width: `${(placements.length / cardsToShow) * 100}%` 
                  }}
                >
                  {placements.map((item, idx) => (
                    <motion.div 
                      key={item.id}
                      className="px-3 shrink-0 flex flex-col h-full"
                      style={{ 
                        width: `${100 / placements.length}%`,
                        minWidth: `${100 / placements.length}%`,
                        flex: `0 0 ${100 / placements.length}%`
                      }}
                      variants={{
                        hidden: { opacity: 0, y: 25 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      transition={{ duration: 0.5, delay: (idx % cardsToShow) * 0.1, ease: "easeOut" }}
                    >
                      {/* Premium White/Dark Glass Card */}
                      <div className="group relative flex flex-col justify-between h-full min-h-[460px] rounded-[32px] p-8 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-[0_15px_40px_rgba(0,0,0,0.02)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-blue-500/10 dark:hover:shadow-emerald-500/10 hover:-translate-y-3 transition-all duration-500 overflow-hidden">
                        
                        {/* Glow accent effect on hover */}
                        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-600/0 via-transparent to-emerald-500/0 group-hover:from-blue-600/10 group-hover:to-emerald-500/10 transition-all duration-500" />
                        
                        {/* Official company logo top-right corner */}
                        <div className="absolute top-6 right-6 flex items-center justify-center px-3 py-1.5 bg-slate-50/90 dark:bg-slate-800/50 rounded-xl border border-slate-200/20 dark:border-slate-700/30 shadow-sm">
                          <CompanyLogo name={item.company_logo} className="h-6 w-auto max-w-[85px] object-contain" />
                        </div>

                        {/* Top contents */}
                        <div className="flex flex-col items-center pt-6">
                          {/* Student Portrait Circular Frame */}
                          <div className="relative">
                            <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500 via-sky-400 to-emerald-400 rounded-full blur-md opacity-25 group-hover:opacity-75 group-hover:scale-110 transition-all duration-500" />
                            <img 
                              src={item.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80'} 
                              alt={item.student_name} 
                              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white dark:border-slate-900 shadow-lg group-hover:scale-[1.05] transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Student Profile Metadata */}
                          <h3 className="text-lg sm:text-xl font-bold font-sans tracking-tight text-slate-800 dark:text-white mt-6 text-center leading-tight">
                            {item.student_name}
                          </h3>
                          <p className="text-xs sm:text-sm font-bold text-blue-600 dark:text-emerald-400 mt-1 text-center">
                            {item.job_role}
                          </p>
                          
                          {/* Academic Details */}
                          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 font-mono text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-100/60 dark:bg-slate-800/40 px-3.5 py-1.5 rounded-full">
                            <span>{item.degree}</span>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <span>{item.batch}</span>
                          </div>
                        </div>

                        {/* Bottom contents */}
                        <div className="flex flex-col items-center pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/50">
                          {/* Placement Package (Optional hide/show) */}
                          {item.show_package && item.package && (
                            <div className="mb-4 text-center">
                              <span className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase block mb-1">
                                CTC PACKAGE
                              </span>
                              <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5 text-emerald-600 dark:text-emerald-400 font-mono text-xs sm:text-sm font-black border border-emerald-500/20 dark:border-emerald-500/10 rounded-full">
                                <TrendingUp size={13} />
                                {item.package} LPA
                              </span>
                            </div>
                          )}

                          {/* Placed Badge */}
                          <div className="w-full">
                            <span className="flex items-center justify-center gap-1.5 w-full text-xs font-bold py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-sans border border-slate-200/30 dark:border-slate-700/30 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-emerald-500 group-hover:text-white group-hover:border-transparent dark:group-hover:bg-gradient-to-r dark:group-hover:from-blue-600 dark:group-hover:to-emerald-500 dark:group-hover:text-white dark:group-hover:border-transparent transition-all duration-300 shadow-sm">
                              <CheckCircle2 size={13} className="shrink-0" />
                              Placed at {item.company_name}
                            </span>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Right Arrow Button */}
              <button
                onClick={() => {
                  setCarouselIndex((prev) => {
                    const maxIndex = Math.max(0, placements.length - cardsToShow);
                    return prev >= maxIndex ? 0 : prev + 1;
                  });
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 lg:-translate-x-6 z-20 w-11 h-11 rounded-full flex items-center justify-center bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-800 shadow-lg hover:scale-110 active:scale-95 hover:bg-gradient-to-tr hover:from-blue-600 hover:to-emerald-500 hover:text-white transition-all duration-300 cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>

              {/* Pagination Dots */}
              {placements.length > cardsToShow && (
                <div className="flex items-center justify-center gap-2.5 mt-10">
                  {Array.from({ length: placements.length - cardsToShow + 1 }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarouselIndex(idx)}
                      className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        carouselIndex === idx 
                          ? 'w-7 bg-blue-600 dark:bg-emerald-400' 
                          : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

            </div>

            {/* Premium Statistics Strip */}
            <div className="mt-28 relative">
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 dark:from-blue-500/2 dark:to-emerald-500/2 rounded-3xl blur-md" />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 p-6 sm:p-10 rounded-3xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/40 dark:border-slate-800/40 shadow-xl dark:shadow-2xl">
                
                {/* Stat 1 */}
                <div className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-300">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-blue-600 dark:text-blue-400 mb-4 shadow-sm">
                    <Users size={22} />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black font-display text-slate-800 dark:text-white tracking-tight">
                    <AnimatedCounter value={5000} />+
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1.5">
                    Students Trained
                  </span>
                </div>

                {/* Stat 2 */}
                <div className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-300">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-emerald-600 dark:text-emerald-400 mb-4 shadow-sm">
                    <Award size={22} />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black font-display text-slate-800 dark:text-white tracking-tight">
                    <AnimatedCounter value={1200} />+
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1.5">
                    Placed Graduates
                  </span>
                </div>

                {/* Stat 3 */}
                <div className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-300">
                  <div className="p-3 bg-sky-50 dark:bg-sky-950/30 rounded-xl text-sky-600 dark:text-sky-400 mb-4 shadow-sm">
                    <Building size={22} />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black font-display text-slate-800 dark:text-white tracking-tight">
                    <AnimatedCounter value={250} />+
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1.5">
                    Hiring Partners
                  </span>
                </div>

                {/* Stat 4 */}
                <div className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-300">
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl text-purple-600 dark:text-purple-400 mb-4 shadow-sm">
                    <TrendingUp size={22} />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black font-display text-slate-800 dark:text-white tracking-tight">
                    <AnimatedCounter value={98} />%
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1.5">
                    Assistance Rate
                  </span>
                </div>

                {/* Stat 5 */}
                <div className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl col-span-2 md:col-span-1 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-300">
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-amber-500 dark:text-amber-400 mb-4 shadow-sm">
                    <Trophy size={22} />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black font-display text-slate-800 dark:text-white tracking-tight">
                    <AnimatedCounter value={50} />+
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1.5">
                    Awards & Honors
                  </span>
                </div>

              </div>
            </div>

          </div>
        </motion.section>
      )}

      {/* 7. OUR INDUSTRY NETWORK */}
      <IndustryNetwork />

      {/* 8. TESTIMONIALS SLIDER SECTION */}
      {testimonials.length > 0 && (
        <section 
          id="testimonials" 
          className="relative py-28 overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-[#0B1220] dark:to-[#080d19] transition-colors duration-300 border-t border-b border-slate-100 dark:border-slate-900/40"
          onMouseEnter={() => setTestHovered(true)}
          onMouseLeave={() => setTestHovered(false)}
        >
          {/* Blurred Radial Shape Decorative Lights */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-[2px] bg-blue-500 rounded-full" />
                <span className="text-blue-600 dark:text-blue-400 font-extrabold tracking-widest text-xs uppercase block">
                  SUCCESS REVIEWS
                </span>
                <div className="w-8 h-[2px] bg-blue-500 rounded-full" />
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
                Testimonials from <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Students & Corporate Partners</span>
              </h2>

              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                We focus on building career capability, leading directly to outstanding corporate satisfaction.
              </p>

              {/* Elegant blue and green divider lines with dots */}
              <div className="flex items-center justify-center gap-1.5 pt-2">
                <div className="w-10 h-[3px] bg-blue-500 rounded-l-full" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <div className="w-10 h-[3px] bg-emerald-500 rounded-r-full" />
              </div>
            </div>

            {/* Carousel Container */}
            <div className="relative px-4 sm:px-12">
              
              {/* Carousel Viewport Wrapper */}
              <div className="overflow-hidden py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch min-h-[380px]">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {(() => {
                      if (testimonials.length === 0) return null;
                      
                      // Calculate visible items
                      const visibleItems: TestimonialItem[] = [];
                      if (testimonials.length <= testCardsToShow) {
                        visibleItems.push(...testimonials);
                      } else {
                        for (let i = 0; i < testCardsToShow; i++) {
                          const targetIndex = (testIndex + i) % testimonials.length;
                          if (testimonials[targetIndex]) {
                            visibleItems.push(testimonials[targetIndex]);
                          }
                        }
                      }

                      return visibleItems.map((test, index) => {
                        const globalIndex = (testIndex + index) % testimonials.length;
                        const accent = getCardAccent(globalIndex);
                        
                        // Handle legacy/new field mapping for full safety
                        const reviewText = test.review || test.text || '';
                        const reviewerPhoto = test.profile_photo || test.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
                        const reviewerDesignation = test.designation || (test.companyOrCollege ? test.companyOrCollege.split(' at ')[0] : 'Trainee');
                        const reviewerCompany = test.company || (test.companyOrCollege ? (test.companyOrCollege.includes(' at ') ? test.companyOrCollege.split(' at ')[1] : test.companyOrCollege) : 'Zentriya');
                        const companyLogo = test.company_logo || (reviewerCompany.toLowerCase().includes('ibm') ? 'ibm' : reviewerCompany.toLowerCase().includes('accenture') ? 'accenture' : reviewerCompany.toLowerCase().includes('innocorp') ? 'innocorp' : '');
                        const isVerified = test.is_verified ?? true;
                        const ratingValue = test.rating ?? 5;
                        const isExpanded = !!expandedTestimonials[test.id];

                        return (
                          <motion.div
                            id={`testimonial-card-${test.id}`}
                            key={test.id}
                            layout
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -30, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25, delay: index * 0.05 }}
                            className={`w-full max-w-[430px] mx-auto rounded-[24px] p-8 shadow-xl relative flex flex-col justify-between transition-all duration-300 bg-white dark:bg-[#0c1425]/90 backdrop-blur-md hover:-translate-y-2 hover:scale-[1.03] ${accent.borderClass} h-full group`}
                          >
                            {/* TOP OF CARD: Quotation Icon & Five gold stars */}
                            <div className="flex items-center justify-between mb-6">
                              <span className={`text-6xl font-serif leading-none select-none ${accent.quoteColor}`}>“</span>
                              <div className="flex gap-0.5 text-amber-400 group-hover:scale-105 transition-transform duration-300">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <svg 
                                    key={i} 
                                    className={`w-5 h-5 ${i < ratingValue ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200 dark:fill-slate-800 dark:text-slate-800'}`} 
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>

                            {/* BODY: Testimonial text with premium typography */}
                            <div className="flex-1 mb-8">
                              <p className={`text-slate-700 dark:text-slate-300 font-sans text-[14px] leading-relaxed ${isExpanded ? '' : 'line-clamp-5'}`}>
                                "{reviewText}"
                              </p>
                              {reviewText.length > 180 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedTestimonials(prev => ({
                                      ...prev,
                                      [test.id]: !prev[test.id]
                                    }));
                                  }}
                                  className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block transition-colors"
                                >
                                  {isExpanded ? 'Read Less' : 'Read More'}
                                </button>
                              )}
                            </div>

                            {/* BOTTOM SECTION */}
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 space-y-4">
                              
                              {/* Row 1: Profile Photo, Name Center, Company Logo Right */}
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={reviewerPhoto} 
                                    alt={test.name} 
                                    className="w-12 h-12 rounded-full object-cover border border-slate-100 dark:border-slate-800 shadow-md transform group-hover:scale-110 transition-transform duration-300"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div>
                                    <h5 className="font-extrabold text-slate-900 dark:text-white text-sm font-display tracking-tight">
                                      {test.name}
                                    </h5>
                                    <p className={`text-[11px] font-bold mt-0.5 ${accent.designationClass}`}>
                                      {reviewerDesignation}
                                    </p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                      {reviewerCompany}
                                    </p>
                                  </div>
                                </div>
                                
                                {companyLogo && (
                                  <div className="shrink-0 flex items-center h-8">
                                    <CompanyLogo name={companyLogo} className="h-6 object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                                  </div>
                                )}
                              </div>

                              {/* Row 2: Verified Badge Left, LinkedIn Icon Right */}
                              <div className="flex items-center justify-between pt-1">
                                {isVerified && (
                                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-sm ${accent.badgeClass}`}>
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Verified
                                  </div>
                                )}

                                {test.linkedin && (
                                  <a 
                                    href={test.linkedin} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-7 h-7 rounded-md bg-[#0A66C2] hover:bg-[#004182] flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30"
                                    title="View LinkedIn Profile"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                                    </svg>
                                  </a>
                                )}
                              </div>

                            </div>
                          </motion.div>
                        );
                      });
                    })()}
                  </AnimatePresence>
                </div>
              </div>

              {/* Navigation Arrows */}
              {testimonials.length > testCardsToShow && (
                <>
                  <button 
                    onClick={() => setTestIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                    className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-25 w-11 h-11 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
                    aria-label="Previous testimonials"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => setTestIndex((prev) => (prev + 1) % testimonials.length)}
                    className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-25 w-11 h-11 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
                    aria-label="Next testimonials"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Pagination Dots */}
              {testimonials.length > testCardsToShow && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTestIndex(i)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${testIndex === i ? 'w-6 bg-blue-600 dark:bg-blue-400' : 'w-2.5 bg-slate-200 dark:bg-slate-800'}`}
                      aria-label={`Go to testimonial page ${i + 1}`}
                    />
                  ))}
                </div>
              )}

            </div>

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
