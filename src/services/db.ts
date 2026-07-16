/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  WebsiteSettings, HeroSlide, AboutSection, ServiceItem, 
  InternshipProgram, CourseItem, GalleryAlbum, GalleryItem, 
  TeamMember, TestimonialItem, JobListing, JobApplication, 
  ContactMessage, BlogPost, FaqItem, DownloadItem, 
  ClientPartnerLogo, PlacementStat, Placement, ActivityLog, SystemNotification, UserProfile, UserRole,
  WhyChooseUsItem, StudentJourneyStep, IndustryPartner,
  Article, ArticleCategory, ArticleStatistic, ProgramItem
} from '../types';

// @ts-ignore
import img1 from '../assets/images/image1.jpeg';
// @ts-ignore
import img2 from '../assets/images/image2.jpeg';
// @ts-ignore
import img3 from '../assets/images/image3.jpeg';
// @ts-ignore
import img4 from '../assets/images/image4.jpeg';
// @ts-ignore
import img5 from '../assets/images/image5.jpeg';
// @ts-ignore
import img6 from '../assets/images/image6.jpeg';
// @ts-ignore
import img7 from '../assets/images/image7.jpeg';
// @ts-ignore
import img8 from '../assets/images/image8.jpeg';
// @ts-ignore
import img9 from '../assets/images/image9.jpeg';
// @ts-ignore
import img10 from '../assets/images/image10.jpeg';
// @ts-ignore
import img11 from '../assets/images/image11.jpeg';
// @ts-ignore
import img12 from '../assets/images/image12.jpeg';
// @ts-ignore
import img13 from '../assets/images/image13.jpeg';
// @ts-ignore
import img14 from '../assets/images/image14.jpeg';
// @ts-ignore
import img15 from '../assets/images/image15.jpeg';
// @ts-ignore
import img16 from '../assets/images/image16.jpeg';
// @ts-ignore
import img17 from '../assets/images/image17.jpeg';
// @ts-ignore
import img18 from '../assets/images/image18.jpeg';
// @ts-ignore
import img19 from '../assets/images/image19.jpeg';
// @ts-ignore
import img20 from '../assets/images/image20.jpeg';
// @ts-ignore
import img21 from '../assets/images/image21.jpeg';
// @ts-ignore
import img22 from '../assets/images/image22.jpeg';
// @ts-ignore
import img23 from '../assets/images/image23.jpeg';
// @ts-ignore
import img24 from '../assets/images/image24.jpeg';
// @ts-ignore
import video1 from '../assets/images/video1.mp4';

// Supabase configuration storage keys
const SUPABASE_URL_KEY = 'zentriya_supabase_url';
const SUPABASE_ANON_KEY = 'zentriya_supabase_anon_key';
const USE_MOCK_DB_KEY = 'zentriya_use_mock_db';

export interface DbConfig {
  url: string;
  anonKey: string;
  useMock: boolean;
}

export function getDbConfig(): DbConfig {
  const url = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem(SUPABASE_URL_KEY) || '';
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem(SUPABASE_ANON_KEY) || '';
  const useMock = localStorage.getItem(USE_MOCK_DB_KEY) === 'true' && !(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
  return { url, anonKey, useMock };
}

export function saveDbConfig(config: DbConfig) {
  localStorage.setItem(SUPABASE_URL_KEY, config.url);
  localStorage.setItem(SUPABASE_ANON_KEY, config.anonKey);
  localStorage.setItem(USE_MOCK_DB_KEY, config.useMock ? 'true' : 'false');
  supabaseInstance = null;
}

// Helper to check if an ID string is a valid UUID
export function isUuid(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// Helper to deterministically map arbitrary string IDs to valid PostgreSQL UUID format
export function ensureUuid(id: string | undefined): string {
  if (!id) {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  if (isUuid(id)) return id;
  
  // Deterministic UUID from non-UUID string using djb2-like string hashing
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash).toString(16).padStart(12, '0');
  return `11111111-2222-3333-4444-${absHash.substring(0, 12)}`;
}

// Runtime fallback flag in case of connection timeouts or explicit mock request
let useMockFallback = false;
let pingPromise: Promise<boolean> | null = null;

export function setMockFallback(value: boolean) {
  useMockFallback = value;
}

export function isMockFallbackActive(): boolean {
  return useMockFallback;
}

export async function checkDatabaseConnection(): Promise<boolean> {
  const config = getDbConfig();
  if (config.useMock || !config.url || !config.anonKey) {
    setMockFallback(true);
    return false;
  }
  if (config.url.includes('placeholder') || config.url.includes('your-') || config.url.includes('example.com')) {
    setMockFallback(true);
    return false;
  }

  const client = getRawSupabase();
  if (!client) {
    setMockFallback(true);
    return false;
  }

  if (pingPromise) return pingPromise;

  const queryPromise = (async () => {
    try {
      const { error } = await client.from('website_settings').select('id').limit(1);
      if (error) {
        // If we get a DB/Postgrest error (like table not found 42P01 or PGRST116), it means connection succeeded!
        const isDbError = !!(error.code || (error as any).status || error.message?.includes('relation') || error.message?.includes('fetch'));
        if (isDbError) {
          console.log('Supabase connection verified successfully (database server is reachable).');
          setMockFallback(false);
          return true;
        }
        console.warn('Database connection check failed:', error);
        setMockFallback(true);
        return false;
      }
      console.log('Supabase connection verified successfully.');
      setMockFallback(false);
      return true;
    } catch (err) {
      console.error('Database connection check error:', err);
      setMockFallback(true);
      return false;
    }
  })();

  const timeoutPromise = new Promise<boolean>((resolve) => {
    setTimeout(() => {
      setMockFallback(true);
      resolve(false);
    }, 10000);
  });

  pingPromise = Promise.race([queryPromise, timeoutPromise]);
  
  pingPromise.finally(() => {
    setTimeout(() => {
      pingPromise = null;
    }, 10000);
  });

  return pingPromise;
}

function wrapSupabaseClient(client: SupabaseClient): SupabaseClient {
  return client;
}

// Lazy Supabase Client Initialization
let rawSupabaseInstance: SupabaseClient | null = null;
let supabaseInstance: SupabaseClient | null = null;

export function getRawSupabase(): SupabaseClient | null {
  const config = getDbConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }
  if (config.url.includes('placeholder') || config.url.includes('your-') || config.url.includes('example.com')) {
    return null;
  }
  if (!rawSupabaseInstance) {
    try {
      rawSupabaseInstance = createClient(config.url, config.anonKey);
    } catch (e) {
      console.warn('Failed to create raw Supabase client:', e);
      return null;
    }
  }
  return rawSupabaseInstance;
}

export function getSupabase(): SupabaseClient | null {
  if (useMockFallback) {
    return null;
  }
  const config = getDbConfig();
  if (config.useMock) {
    return null;
  }
  const rawClient = getRawSupabase();
  if (!rawClient) {
    return null;
  }
  if (!supabaseInstance) {
    try {
      supabaseInstance = wrapSupabaseClient(rawClient);
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return supabaseInstance;
}

// ----------------------------------------------------------------------
// SEED DATA FOR MOCK BACKEND
// ----------------------------------------------------------------------

const defaultSettings: WebsiteSettings = {
  id: 'settings_01',
  companyName: 'Zentriya IT Solutions Private Limited',
  logoUrl: '/logo.png',
  faviconUrl: '/logo.png',
  primaryColor: '#059669', // Emerald Green (company brochure)
  secondaryColor: '#1e3a8a', // Deep Blue
  whatsappNumber: '+917989270174',
  contactEmail: 'info.zentriya@gmail.com',
  contactPhones: ['+91 7989270174', '+91 95509 50705', '+91 6301550330'],
  address: '', // Removed as per instructions
  googleMapEmbedUrl: '', // Removed as per instructions to not display additional contact info
  popupBannerUrl: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=800&h=400&fit=crop&q=80',
  popupBannerActive: true,
  announcementText: '🚀 Admissions open for Fall 2026 Enterprise Internship Programs! Apply today to secure a seat.',
  announcementActive: true,
  whyChooseUsTitle: 'Why Choose Us?',
  socialLinks: {
    facebook: 'https://facebook.com/zentriyait',
    twitter: 'https://twitter.com/zentriyait',
    linkedin: 'https://linkedin.com/company/zentriya-it-solutions',
    instagram: 'https://instagram.com/zentriyait',
    youtube: 'https://youtube.com/zentriyait'
  },
  seo: {
    metaTitle: 'Zentriya IT Solutions | Enterprise IT & Placement-Driven Internships',
    metaDescription: 'Zentriya IT Solutions is a premium corporate provider of software development, consulting services, placement-driven internships, global certifications, and bootcamps.',
    metaKeywords: 'IT solutions, software development, coding bootcamps, internships in Bangalore, corporate training, placement programs',
    ogImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=630&fit=crop&q=80'
  }
};

const defaultHeroSlides: HeroSlide[] = [
  {
    id: 'hero_1',
    title: 'Transforming Enterprise Ambitions Into Code',
    subtitle: 'Zentriya IT Solutions delivers premium software engineering, business-critical cloud consulting, and corporate technology ecosystems.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=900&fit=crop&q=80',
    ctaText: 'Explore Enterprise Services',
    ctaLink: '/services',
    order: 1
  },
  {
    id: 'hero_2',
    title: 'Elite Technical Internships & Direct Placements',
    subtitle: 'Bridge the academic-industry gap. Work on live enterprise projects, learn from principal architects, and secure premium career roles.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&h=900&fit=crop&q=80',
    ctaText: 'View Internship Programs',
    ctaLink: '/internships',
    order: 2
  },
  {
    id: 'hero_3',
    title: 'Architecting Scalable Cloud & AI Platforms',
    subtitle: 'Partner with our globally certified experts to leverage Kubernetes, Serverless architectures, Deep Learning models, and robust databases.',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&h=900&fit=crop&q=80',
    ctaText: 'Consulting Solutions',
    ctaLink: '/services',
    order: 3
  }
];

const defaultAbout: AboutSection = {
  id: 'about_1',
  title: 'ABOUT US',
  description: 'Zentriya IT Solutions Private Limited is an innovation-driven EdTech powerhouse committed to transforming education into employability. We empower aspiring students and professionals through future-focused IT and Non-IT training, real-time internships, career acceleration programs, placement solutions and technology-driven learning experiences.\n\nBy fostering strong industry collaborations, academic alliances and skill-centric learning ecosystems, Zentriya is creating a new generation of confident, industry-ready professionals equipped for the evolving digital world.',
  image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&h=900&fit=crop&q=80',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const defaultServices: ServiceItem[] = [
  {
    id: 'service_1',
    title: 'Internships',
    description: 'Placement-driven, industry-aligned internship programs designed to bridge the academic-industry gap.',
    detailedDescription: 'Our internships provide high-performance tech exposure. Under the guidance of principal engineers and corporate architects, students collaborate on real enterprise-grade repositories, learn modern DevOps practices, participate in daily standups, and undergo strict code reviews. This intensive experiential environment ensures every candidate becomes fully productive.',
    icon: 'GraduationCap',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=500&fit=crop&q=80',
    features: ['Live Project Collaboration', 'Professional Code Reviews', 'Resume & LinkedIn Optimisation', '100% Interview Referrals'],
    benefits: ['Industry-Recognised Corporate Certification', 'Direct Placement Opportunities', 'Strong Alumni Network', 'Hands-on Git & CI/CD Exposure'],
    order: 1,
    isActive: true,
    galleryUrls: [],
    themeColor: 'Green',
    buttonText: 'View Programs →',
    buttonLink: '/internships'
  },
  {
    id: 'service_2',
    title: 'Software Development',
    description: 'Custom corporate SaaS engineering, robust mobile apps, and scalable web architectures.',
    detailedDescription: 'Zentriya builds high-security, ultra-scalable software systems. From specialized multi-tenant ERP platforms and CRM tools to native mobile applications, our principal engineers construct clean, reliable, and highly performant architectures that drive business transformation and optimize user engagement.',
    icon: 'Terminal',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop&q=80',
    features: ['SaaS & Cloud Native Architecture', 'Custom CRM & ERP Portals', 'iOS & Android Apps', 'Microservices & API Integration'],
    benefits: ['Optimised Performance at Scale', 'High-Security Code Standards', 'Post-Deployment Lifetime Support', 'Full Intellectual Property Ownership'],
    order: 2,
    isActive: true,
    galleryUrls: [],
    themeColor: 'Blue',
    buttonText: 'Build with Us →',
    buttonLink: '/contact'
  },
  {
    id: 'service_3',
    title: 'Training & Skill Development',
    description: 'Cutting-edge corporate and collegiate technical masterclasses to upskill talent.',
    detailedDescription: 'We design custom-tailored curriculum blueprints in React, TypeScript, Cloud Architecture, DevOps pipelines, Generative AI, and full-stack engineering. Our instruction prioritizes active lab hours, project-focused portfolios, and real-world execution, preparing teams to ship production-grade code confidently.',
    icon: 'CodeXml',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop&q=80',
    features: ['Principal Architect Instructors', 'Hands-on Sandbox Labs', 'Customised Corporate Blueprints', 'Continuous Assessments'],
    benefits: ['Accelerated Tech Mastery', 'Bridged Technological Skill Gaps', 'Measurable Team Productivity Boost', 'Verifiable Learning Credentials'],
    order: 3,
    isActive: true,
    galleryUrls: [],
    themeColor: 'Purple',
    buttonText: 'Start Learning →',
    buttonLink: '/courses'
  },
  {
    id: 'service_4',
    title: 'Bootcamps & Hackathons',
    description: 'Immersive technical bootcamps and rapid-prototyping sprint hackathons.',
    detailedDescription: 'Our high-energy bootcamps and rapid coding hackathons inspire collaborative innovation. We partner with elite academic and corporate institutions to lead multi-day coding sprints, testing real-world problem-solving abilities, product prototyping speeds, and technical agility.',
    icon: 'Brain',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop&q=80',
    features: ['36-Hour Coding Sprints', 'Real-World Hackathon Briefs', 'Active Mentor Evaluations', 'Cash Prizes & Referral Awards'],
    benefits: ['Rapid Prototype Development', 'Collaborative Team Building', 'Instant Talent Discovery', 'Immersive Problem-Solving Experience'],
    order: 4,
    isActive: true,
    galleryUrls: [],
    themeColor: 'Orange',
    buttonText: 'Join Sprint →',
    buttonLink: '/contact'
  },
  {
    id: 'service_5',
    title: 'Consulting Services',
    description: 'Enterprise cloud migrations, high-security infrastructure audits, and technology consulting.',
    detailedDescription: 'Partner with our seasoned systems architects to design robust technology roadmaps. We specialize in migrating legacy monoliths to AWS, Azure, and Google Cloud, structuring robust CI/CD deployment pipelines, ensuring strict ISO compliance, and optimizing databases for high throughput.',
    icon: 'CloudLightning',
    imageUrl: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800&h=500&fit=crop&q=80',
    features: ['AWS / Azure Cloud Migrations', 'DevOps & IaC (Terraform) Audits', 'Relational Database Optimisation', 'IT Security Compliance Checks'],
    benefits: ['Up to 40% Infrastructure Cost Reduction', 'Minimised System Downtime', 'Guaranteed Security Hardening', 'Scalable Enterprise Roadmaps'],
    order: 5,
    isActive: true,
    galleryUrls: [],
    themeColor: 'Cyan',
    buttonText: 'Consult Expert →',
    buttonLink: '/contact'
  },
  {
    id: 'service_6',
    title: 'Projects & Placements',
    description: 'End-to-end placement referrals, recruitment coordination, and portfolio reviews.',
    detailedDescription: 'Our dedicated HR recruitment cell connects certified talent directly with a network of over 120 partner software corporations across major tech hubs. We conduct thorough resume auditing, LinkedIn branding workshops, and rigorous mock technical interviews to guarantee stellar placement conversion rates.',
    icon: 'Briefcase',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop&q=80',
    features: ['Direct Hiring Referrals', 'Comprehensive Mock Interviews', 'Portfolio & Resume Styling', 'Placement Success Celebrations'],
    benefits: ['Access to Exclusive Tech Roles', 'Substantial Interview Success Boost', 'Direct Connection to 120+ Recruiter Networks', 'Strong Placement-Oriented Training'],
    order: 6,
    isActive: true,
    galleryUrls: [],
    themeColor: 'Emerald',
    buttonText: 'Get Placed →',
    buttonLink: '/contact'
  },
  {
    id: 'service_7',
    title: 'Global Certifications',
    description: 'Accredited prep courses and corporate verification seals for global cloud, dev, and security credentials.',
    detailedDescription: 'Prepare for globally recognized certificates with our accredited guidance. Zentriya is an authorized training partner, delivering aligned masterclasses for AWS Solutions Architect, Microsoft Azure Associate, ISO Security compliance, and Agile Scrum Master certifications with verifiable QR-coded badges.',
    icon: 'Award',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop&q=80',
    features: ['AWS / Azure Aligned Training', 'ISO Standards Prep', 'Scrum Master Masterclasses', 'Verifiable QR-Coded Badges'],
    benefits: ['Globally Credible Skills', 'Accelerated Career Trajectory', 'Enhanced Interview Call Volumes', 'Verified Expertise Standards'],
    order: 7,
    isActive: true,
    galleryUrls: [],
    themeColor: 'Indigo',
    buttonText: 'Get Certified →',
    buttonLink: '/contact'
  }
];

const defaultInternships: InternshipProgram[] = [
  {
    id: 'intern_1',
    title: 'Full Stack Web Development (MERN/Java Stack)',
    duration: '3 Months / 6 Months',
    technology: 'React, Node.js, Express, MongoDB, PostgreSQL, Spring Boot',
    mode: 'Hybrid',
    description: 'An elite, comprehensive coding sprint. Interns write clean, production-grade web interfaces, design secure REST/GraphQL APIs, manage relational databases, and deploy live apps onto AWS and Cloud Run.',
    price: 15000,
    discountPrice: 11999,
    features: [
      'Live AWS deployment and production deployment reviews',
      'Daily mentor-led code reviews and sprint retrospectives',
      '1-on-1 resume optimization and LinkedIn branding',
      'Guaranteed interview referrals upon successful evaluation'
    ],
    certificateDetails: 'Jointly issued corporate internship credential and placement completion letter.',
    bannerUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=500&fit=crop&q=80',
    isActive: true
  },
  {
    id: 'intern_2',
    title: 'Enterprise Cloud Computing & DevOps Engineering',
    duration: '3 Months',
    technology: 'AWS, Docker, Kubernetes, Terraform, GitHub Actions',
    mode: 'Online',
    description: 'Master modern cloud provisioning. Build structured CI/CD pipelines, package scalable microservices, manage Docker registries, configure ingress routing, and deploy production Kubernetes clusters.',
    price: 18000,
    discountPrice: 14499,
    features: [
      'Provision real cloud assets via Infrastructure-as-Code (Terraform)',
      'Construct end-to-end automated GitHub Actions CI/CD pipelines',
      'Preparation support for AWS Certified Solutions Architect exam',
      'Direct referrals into premium IT operations and cloud consultancies'
    ],
    certificateDetails: 'AWS/DevOps Technical Associate Internship Certificate.',
    bannerUrl: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800&h=500&fit=crop&q=80',
    isActive: true
  },
  {
    id: 'intern_3',
    title: 'Data Science, Machine Learning & Generative AI',
    duration: '6 Months',
    technology: 'Python, TensorFlow, Pandas, SQL, Google GenAI SDK',
    mode: 'Hybrid',
    description: 'Build predictive solutions. Gather real dataset metrics, perform feature engineering, train Deep Learning networks, and configure smart AI chat agents utilizing Gemini LLMs and prompt tuning.',
    price: 20000,
    discountPrice: 15999,
    features: [
      'Build and deploy real API routes proxying LLM integrations',
      'Perform advanced analytics on live SQL databases',
      'Incorporate vector databases (Pinecone/pgvector) for custom RAG platforms',
      'Opportunity to collaborate on genuine research/corporate papers'
    ],
    certificateDetails: 'AI Specialist Internship Certificate and project portfolio badge.',
    bannerUrl: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&h=500&fit=crop&q=80',
    isActive: true
  }
];

const defaultCourses: CourseItem[] = [
  {
    id: 'course_1',
    title: 'Full Stack Web Development',
    duration: '3 / 6 Months',
    category: 'Web Development',
    description: 'An elite, comprehensive coding sprint. Build modern web applications with industry-standard tools and technologies.',
    syllabus: [
      'Weeks 1-4: Advanced Frontend with React & Tailwind CSS',
      'Weeks 5-8: Backend Engineering with Node.js, Express & MongoDB',
      'Weeks 9-12: Production-grade deployments, security, and AWS Cloud integration'
    ],
    price: 15000,
    discountPrice: 11999,
    mode: 'Hybrid',
    features: ['Live Projects', 'Mentor Support', 'Certificate'],
    isActive: true,
    bannerUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=500&fit=crop&q=80',
    order: 1
  },
  {
    id: 'course_2',
    title: 'Enterprise Cloud & DevOps',
    duration: '3 Months',
    category: 'Cloud & DevOps',
    description: 'Master cloud infrastructure, CI/CD pipelines, Docker, Kubernetes and DevOps best practices from scratch.',
    syllabus: [
      'Weeks 1-4: Cloud Architecture Foundations & AWS Services',
      'Weeks 5-8: Containerization with Docker & Orchestration with Kubernetes',
      'Weeks 9-12: CI/CD Pipelines (GitHub Actions) & Infrastructure as Code (Terraform)'
    ],
    price: 18000,
    discountPrice: 14499,
    mode: 'Online',
    features: ['Live Projects', 'Mentor Support', 'Certificate'],
    isActive: true,
    bannerUrl: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800&h=500&fit=crop&q=80',
    order: 2
  },
  {
    id: 'course_3',
    title: 'Data Science & Machine Learning',
    duration: '6 Months',
    category: 'Data Science & ML',
    description: 'Learn data analysis, machine learning algorithms, and build AI-powered real-world solutions.',
    syllabus: [
      'Weeks 1-8: Data Science Core (Python, Pandas, SQL, & Visualization)',
      'Weeks 9-16: Machine Learning Models, Regression, and Supervised Learning',
      'Weeks 17-24: Generative AI, LLM Integrations, and Prompt Engineering'
    ],
    price: 20000,
    discountPrice: 15999,
    mode: 'Hybrid',
    features: ['Live Projects', 'Mentor Support', 'Certificate'],
    isActive: true,
    bannerUrl: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&h=500&fit=crop&q=80',
    order: 3
  },
  {
    id: 'course_4',
    title: 'Cybersecurity & Ethical Hacking',
    duration: '3 Months',
    category: 'Cybersecurity',
    description: 'Learn modern security architectures, network defense mechanisms, penetration testing, and digital forensics.',
    syllabus: [
      'Weeks 1-4: Networking Security Protocols & Vulnerability Assessment',
      'Weeks 5-8: Penetration Testing Methodologies & System Audits',
      'Weeks 9-12: Incident Response Frameworks & Threat Intel Analysis'
    ],
    price: 16000,
    discountPrice: 12999,
    mode: 'Online',
    features: ['Live Projects', 'Mentor Support', 'Certificate'],
    isActive: true,
    bannerUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=500&fit=crop&q=80',
    order: 4
  },
  {
    id: 'course_5',
    title: 'UI/UX Product Design',
    duration: '3 Months',
    category: 'Product Design',
    description: 'Master UI elements, typography, grid layouts, advanced Figma prototyping, and user testing practices.',
    syllabus: [
      'Weeks 1-4: Design Principles, Typography & Color Systems',
      'Weeks 5-8: Advanced Figma Prototyping & Design Systems',
      'Weeks 9-12: User Testing, Portfolio Case Study & Presentation'
    ],
    price: 14000,
    discountPrice: 10999,
    mode: 'Hybrid',
    features: ['Live Projects', 'Mentor Support', 'Certificate'],
    isActive: true,
    bannerUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=500&fit=crop&q=80',
    order: 5
  }
];

const defaultPrograms: ProgramItem[] = [
  {
    id: 'prog_1',
    title: 'Full Stack Web Development',
    duration: '3 / 6 Months',
    category: 'Web Development',
    description: 'An elite, comprehensive coding sprint. Build modern web applications with industry-standard tools and technologies.',
    cover_image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=500&fit=crop&q=80',
    mode: 'Hybrid',
    syllabus: [
      'Weeks 1-4: Advanced Frontend with React & Tailwind CSS',
      'Weeks 5-8: Backend Engineering with Node.js, Express & MongoDB',
      'Weeks 9-12: Production-grade deployments, security, and AWS Cloud integration'
    ],
    badges: ['Live Projects', 'Mentor Support', 'Certificate'],
    display_order: 1,
    is_active: true
  },
  {
    id: 'prog_2',
    title: 'Enterprise Cloud & DevOps',
    duration: '3 Months',
    category: 'Cloud & DevOps',
    description: 'Master cloud infrastructure, CI/CD pipelines, Docker, Kubernetes and DevOps best practices from scratch.',
    cover_image: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800&h=500&fit=crop&q=80',
    mode: 'Online',
    syllabus: [
      'Weeks 1-4: Cloud Architecture Foundations & AWS Services',
      'Weeks 5-8: Containerization with Docker & Orchestration with Kubernetes',
      'Weeks 9-12: CI/CD Pipelines (GitHub Actions) & Infrastructure as Code (Terraform)'
    ],
    badges: ['Live Projects', 'Mentor Support', 'Certificate'],
    display_order: 2,
    is_active: true
  },
  {
    id: 'prog_3',
    title: 'Data Science & Machine Learning',
    duration: '6 Months',
    category: 'Data Science & ML',
    description: 'Learn data analysis, machine learning algorithms, and build AI-powered real-world solutions.',
    cover_image: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&h=500&fit=crop&q=80',
    mode: 'Hybrid',
    syllabus: [
      'Weeks 1-8: Data Science Core (Python, Pandas, SQL, & Visualization)',
      'Weeks 9-16: Machine Learning Models, Regression, and Supervised Learning',
      'Weeks 17-24: Generative AI, LLM Integrations, and Prompt Engineering'
    ],
    badges: ['Live Projects', 'Mentor Support', 'Certificate'],
    display_order: 3,
    is_active: true
  },
  {
    id: 'prog_4',
    title: 'Cybersecurity & Ethical Hacking',
    duration: '3 Months',
    category: 'Cybersecurity',
    description: 'Learn modern security architectures, network defense mechanisms, penetration testing, and digital forensics.',
    cover_image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=500&fit=crop&q=80',
    mode: 'Online',
    syllabus: [
      'Weeks 1-4: Networking Security Protocols & Vulnerability Assessment',
      'Weeks 5-8: Penetration Testing Methodologies & System Audits',
      'Weeks 9-12: Incident Response Frameworks & Threat Intel Analysis'
    ],
    badges: ['Live Projects', 'Mentor Support', 'Certificate'],
    display_order: 4,
    is_active: true
  },
  {
    id: 'prog_5',
    title: 'UI/UX Product Design',
    duration: '3 Months',
    category: 'Product Design',
    description: 'Master UI elements, typography, grid layouts, advanced Figma prototyping, and user testing practices.',
    cover_image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=500&fit=crop&q=80',
    mode: 'Hybrid',
    syllabus: [
      'Weeks 1-4: Design Principles, Typography & Color Systems',
      'Weeks 5-8: Advanced Figma Prototyping & Design Systems',
      'Weeks 9-12: User Testing, Portfolio Case Study & Presentation'
    ],
    badges: ['Live Projects', 'Mentor Support', 'Certificate'],
    display_order: 5,
    is_active: true
  }
];

const defaultGalleryAlbums: GalleryAlbum[] = [
  { id: 'album_workshop', title: '6-Day SketchUp Workshop 2026', description: 'Hands-on SketchUp and Landscape Design workshop at Bapatla Engineering College.', category: 'Workshops', coverImageUrl: img11 }
];

const defaultGalleryItems: GalleryItem[] = [
  { id: 'gal_1', albumId: 'album_workshop', type: 'image', url: img1, title: 'Workshop Inauguration & Lighting of Lamp', category: 'Inauguration' },
  { id: 'gal_2', albumId: 'album_workshop', type: 'image', url: img2, title: 'Keynote Session on 3D Modeling & Rendering', category: 'Seminars' },
  { id: 'gal_3', albumId: 'album_workshop', type: 'image', url: img3, title: 'Interactive Laboratory Training Session', category: 'Labs' },
  { id: 'gal_4', albumId: 'album_workshop', type: 'image', url: img4, title: 'Hands-on CAD and SketchUp Modeling Practice', category: 'Labs' },
  { id: 'gal_5', albumId: 'album_workshop', type: 'image', url: img5, title: 'Expert Guidance on Architectural Visualization', category: 'Workshops' },
  { id: 'gal_6', albumId: 'album_workshop', type: 'image', url: img6, title: 'Students Collaborating on Design Projects', category: 'Labs' },
  { id: 'gal_7', albumId: 'album_workshop', type: 'image', url: img7, title: 'Review of Final Student Showcase Submissions', category: 'Workshops' },
  { id: 'gal_8', albumId: 'album_workshop', type: 'image', url: img8, title: 'Outstanding Student Award & Honors', category: 'Awards' },
  { id: 'gal_9', albumId: 'album_workshop', type: 'image', url: img9, title: 'Valedictory Session & Certification Distribution', category: 'Awards' },
  { id: 'gal_10', albumId: 'album_workshop', type: 'image', url: img10, title: 'Vote of Thanks & Event Conclusion', category: 'Inauguration' },
  { id: 'gal_11', albumId: 'album_workshop', type: 'image', url: img11, title: '6-Day Workshop Batch Group Portrait', category: 'Workshops' },
  { id: 'gal_12', albumId: 'album_workshop', type: 'image', url: img12, title: 'SketchUp Advanced Rendering Techniques', category: 'Workshops' },
  { id: 'gal_13', albumId: 'album_workshop', type: 'image', url: img13, title: 'Interactive Hands-on Design Project Session', category: 'Labs' },
  { id: 'gal_14', albumId: 'album_workshop', type: 'image', url: img14, title: 'Collaborative Team Design Critique', category: 'Seminars' },
  { id: 'gal_15', albumId: 'album_workshop', type: 'image', url: img15, title: 'Landscape Modeling Demonstration', category: 'Workshops' },
  { id: 'gal_16', albumId: 'album_workshop', type: 'image', url: img16, title: 'Architecture and Ecology Integration Lecture', category: 'Seminars' },
  { id: 'gal_17', albumId: 'album_workshop', type: 'image', url: img17, title: 'Practical CAD Drafting Exercises', category: 'Labs' },
  { id: 'gal_18', albumId: 'album_workshop', type: 'image', url: img18, title: 'Guest Lecture on Digital Twins and Smart Cities', category: 'Seminars' },
  { id: 'gal_19', albumId: 'album_workshop', type: 'image', url: img19, title: 'Student Exhibition of 3D Project Renderings', category: 'Workshops' },
  { id: 'gal_20', albumId: 'album_workshop', type: 'image', url: img20, title: 'Workshop Closing Remarks and Feedback', category: 'Inauguration' },
  { id: 'gal_21', albumId: 'album_workshop', type: 'image', url: img21, title: 'Certificate Award Ceremony Highlights', category: 'Awards' },
  { id: 'gal_22', albumId: 'album_workshop', type: 'image', url: img22, title: 'Valedictory Batch Group Photo Session', category: 'Workshops' },
  { id: 'gal_23', albumId: 'album_workshop', type: 'image', url: img23, title: 'Honoring Guest Speakers with Mementos', category: 'Awards' },
  { id: 'gal_24', albumId: 'album_workshop', type: 'image', url: img24, title: 'Inspiring Final Student Presentation', category: 'Seminars' },
  { id: 'gal_video1', albumId: 'album_workshop', type: 'video', url: video1, title: '6-Day Workshop Interactive Highlights Video', category: 'Workshops' }
];

const defaultTeam: TeamMember[] = [
  {
    id: 'team_1',
    name: 'Dr. Anand Kumar',
    designation: 'Managing Director & Co-Founder',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
    bio: 'An industry veteran with 22+ years of enterprise architecture experience. Formerly technical advisor at Siemens and IBM. Enjoys bootstrapping high-efficiency database microservices.',
    socialLinks: { linkedin: 'https://linkedin.com', email: 'anand@zentriya.com' },
    order: 1
  },
  {
    id: 'team_2',
    name: 'Meera Deshmukh',
    designation: 'Chief Operations Officer (COO)',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80',
    bio: 'Fosters global academic tie-ups and coordinates corporate operations. Specialized in tech workforce scaling, and agile project methodologies.',
    socialLinks: { linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' },
    order: 2
  },
  {
    id: 'team_3',
    name: 'Rahul Sen',
    designation: 'Head of Placement & Corporate Relations',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&q=80',
    bio: 'Connecting Zentriya to global IT recruiters. Coordinates recruiters across 120+ software product firms in Bangalore, Pune, and Hyderabad.',
    socialLinks: { linkedin: 'https://linkedin.com', email: 'rahul.sen@zentriya.com' },
    order: 3
  }
];

const defaultTestimonials: TestimonialItem[] = [
  {
    id: 'test_1',
    name: 'Preeti Sharma',
    companyOrCollege: 'Software Engineer at IBM (Alumna)',
    type: 'Student',
    text: 'The Full Stack Internship at Zentriya completely changed my trajectory. I learned GitHub collaboration, Dockerized containerization, and clean database structures. The mock interviews by Rahul Sir secured my offer at IBM.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80',
    designation: 'Software Engineer',
    company: 'IBM (Alumna)',
    company_logo: 'ibm',
    profile_photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80',
    review: 'The Full Stack Internship at Zentriya completely changed my trajectory. I learned GitHub collaboration, Dockerized containerization, and clean database structures. The mock interviews by Rahul Sir secured my offer at IBM.',
    linkedin: 'https://linkedin.com',
    is_verified: true,
    display_order: 1,
    is_active: true
  },
  {
    id: 'test_2',
    name: 'Vikram Aditya',
    companyOrCollege: 'VP of Tech, InnoCorp Solutions Ltd',
    type: 'Corporate',
    text: 'We recruited 12 engineers from Zentriya IT solutions in our 2025 cycle. Every candidate had robust coding discipline, understood git commands thoroughly, and had worked on real APIs. Outstanding training quality.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&q=80',
    designation: 'VP of Technology',
    company: 'InnoCorp Solutions Ltd',
    company_logo: 'innocorp',
    profile_photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&q=80',
    review: 'We recruited 12 engineers from Zentriya IT Solutions in our 2025 drive. Every candidate had strong coding discipline, understood git commands thoroughly, and had worked on real APIs. Outstanding training quality!',
    linkedin: 'https://linkedin.com',
    is_verified: true,
    display_order: 2,
    is_active: true
  },
  {
    id: 'test_3',
    name: 'Suhail Ahmed',
    companyOrCollege: 'Systems Engineer at Accenture (Alumnus)',
    type: 'Student',
    text: 'Zentriyas Cloud Computing syllabus perfectly mimics what modern corporates use. Setting up AWS instances and configuring Terraform prepared me fully. Highly recommended training!',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80',
    designation: 'Systems Engineer',
    company: 'Accenture (Alumnus)',
    company_logo: 'accenture',
    profile_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80',
    review: 'Zentriya’s Cloud Computing syllabus perfectly mimics what modern corporates use. Setting up AWS instances and configuring Terraform prepared me fully. Highly recommended training!',
    linkedin: 'https://linkedin.com',
    is_verified: true,
    display_order: 3,
    is_active: true
  }
];

const defaultJobs: JobListing[] = [
  {
    id: 'job_1',
    title: 'Senior Frontend Developer (React/TS)',
    department: 'Engineering',
    location: 'Bangalore (On-site)',
    type: 'Full-time',
    experience: '4 - 7 Years',
    description: 'We are seeking a senior frontend master to lead the client-facing architecture of our new real-time analytics product. You will optimize rendering, design custom components, and mentor 4 junior developers.',
    requirements: [
      'Expert level knowledge of React, modern state managers (Zustand/Redux), and TypeScript',
      'Solid understand of browser paint loops, virtual lists, and layout performance profiling',
      'Demonstrated portfolio of complex dashboard applications'
    ],
    responsibilities: [
      'Write highly optimized, scalable design tokens and custom components',
      'Implement strict TypeScript interfaces and support standard unit testing suites',
      'Collaborate with backend architects to streamline secure GraphQL and REST operations'
    ],
    salaryRange: '₹14,00,000 - ₹20,00,000 LPA',
    isActive: true,
    createdAt: '2026-06-20T09:00:00Z'
  },
  {
    id: 'job_2',
    title: 'Corporate Technology Trainer (Web Technologies)',
    department: 'Corporate Enablement',
    location: 'Bangalore / Hybrid',
    type: 'Full-time',
    experience: '2 - 5 Years',
    description: 'Help bridge the industry-academy divide. You will deliver premium structured training bootcamps to our client universities and lead interactive MERN sprint mentorship programs.',
    requirements: [
      'Excellent vocal communication skills, empathy, and classroom management',
      'In-depth mastery of HTML, CSS, React, Express, and PostgreSQL/MongoDB',
      'Prior experience teaching, leading workshops, or authoring technical articles'
    ],
    responsibilities: [
      'Conduct daily classroom instruction, debug labs, and grade project submissions',
      'Optimize the academic syllabus dynamically in sync with industry recruiters',
      'Support HR cell in administering weekly coding hackathons and mock assessments'
    ],
    salaryRange: '₹6,00,000 - ₹10,00,000 LPA',
    isActive: true,
    createdAt: '2026-06-22T10:30:00Z'
  }
];

const defaultArticles: Article[] = [
  {
    id: 'art_1',
    title: 'Demystifying Serverless Architectures for Enterprise Platforms',
    description: 'Explore how serverless models help businesses reduce infrastructure cost to zero during idle periods while maintaining scalability and reliability.',
    excerpt: 'Explore how serverless models help businesses reduce infrastructure cost to zero during idle periods while maintaining scalability and reliability.',
    content: `<h2>The Rise of Serverless Compute</h2>
<p>For decades, enterprise platforms were hosted on massive, heavy server architectures that required persistent care and feeding from IT teams. If a system experienced a traffic surge, servers crashed. If traffic slumped, companies overpaid for unused CPU hours. Serverless computing completely rewrites this calculus.</p>
<h3>What is Serverless?</h3>
<p>Contrary to its name, servers are still involved, but the developer never has to provision, manage, or patch them. Code is packaged into functional execution routes (like AWS Lambda, Google Cloud Functions, or Cloud Run) that boot up dynamically when triggered, perform their task, and instantly scale back down to zero.</p>
<h3>Why Enterprises are Migrating</h3>
<ul>
  <li><strong>Zero idle overhead:</strong> Pay exclusively for the exact milliseconds your code runs.</li>
  <li><strong>Auto-scalability:</strong> Instantly handle sudden surges without manual intervention.</li>
  <li><strong>Developer Focus:</strong> Spend hours writing core business logic instead of debugging OS kernels.</li>
</ul>`,
    cover_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    read_time: '6 min read',
    read_time_minutes: 6,
    category: 'Cloud & DevOps',
    author_name: 'Dr. Anand Kumar',
    author_image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    author_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    author_designation: 'Cloud Architect',
    published_date: 'Jun 18, 2026',
    published_at: 'Jun 18, 2026',
    display_order: 1,
    is_active: true
  },
  {
    id: 'art_2',
    title: 'The AI Revolution: Integrating Custom LLM APIs Safely into Corporate Systems',
    description: 'Learn the essential security architectures required to proxy Generative AI services safely without exposing sensitive data or violating compliance.',
    excerpt: 'Learn the essential security architectures required to proxy Generative AI services safely without exposing sensitive data or violating compliance.',
    content: `<h2>Enterprise AI Integration Safely</h2>
<p>Generative Artificial Intelligence is transforming productivity. From custom customer service agents to smart internal search tools, companies are eager to harness LLM models like Gemini. However, simply copy-pasting API keys into public frontends is a massive security hazard.</p>
<h3>The Risk: Exposed Keys & Data Leakage</h3>
<p>If an API key is shipped in client-side code, anyone can inspect the browser devtools, steal the key, and rack up thousands of dollars of costs. Furthermore, uploading sensitive corporate intellectual property into generic public AI models risks training public networks on your proprietary information.</p>
<h3>The Solution: Server-Side Proxies & Private Endpoints</h3>
<p>To safely utilize AI capabilities, enterprises must route all LLM requests through secure, authenticated backend APIs, utilizing environment secrets. In this article, we outline best practices for engineering high-integrity, rate-limited, and safe AI middleware layers.</p>`,
    cover_image: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&q=80',
    read_time: '7 min read',
    read_time_minutes: 7,
    category: 'AI & Machine Learning',
    author_name: 'Er. Suresh Deshmukh',
    author_image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    author_avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    author_designation: 'AI Solutions Architect',
    published_date: 'Jun 20, 2026',
    published_at: 'Jun 20, 2026',
    display_order: 2,
    is_active: true
  },
  {
    id: 'art_3',
    title: 'Cloud Cost Optimization 2026: Strategies That Actually Work',
    description: 'Deep dive into proven cost optimization techniques using modern cloud-native services and serverless patterns for maximum ROI.',
    excerpt: 'Deep dive into proven cost optimization techniques using modern cloud-native services and serverless patterns for maximum ROI.',
    content: `<h2>Mastering Cloud Cost Optimization</h2>
<p>Public cloud resources are simple to spin up, which often leads to "cloud sprawl" and astronomical monthly invoices. Optimization is no longer just about shutting down unused machines; it is about active financial engineering (FinOps).</p>
<h3>Proven Techniques for Reducing Cost</h3>
<ul>
  <li><strong>Rightsizing Compute:</strong> Audit CPU and RAM telemetry using CloudWatch or Google Cloud Monitoring to match resource size with actual application workloads.</li>
  <li><strong>Leveraging Spot/Preemptible Instances:</strong> Use non-critical compute pools for stateless workers at discounts up to 80%.</li>
  <li><strong>Implementing Autonomic Scale:</strong> Combine serverless databases with auto-scaling compute groups to match real-time demand curves.</li>
</ul>`,
    cover_image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80',
    read_time: '5 min read',
    read_time_minutes: 5,
    category: 'Architecture',
    author_name: 'Priya Nair',
    author_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    author_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    author_designation: 'Cloud FinOps Engineer',
    published_date: 'Jun 22, 2026',
    published_at: 'Jun 22, 2026',
    display_order: 3,
    is_active: true
  },
  {
    id: 'art_4',
    title: 'Architecting Zero Trust Microservices in High-Scale Kubernetes',
    description: 'Discover how Zero Trust networks prevent internal lateral attacks in modern containerized orchestrations and microservices.',
    excerpt: 'Discover how Zero Trust networks prevent internal lateral attacks in modern containerized orchestrations and microservices.',
    content: `<h2>The Philosophy of Zero Trust</h2>
<p>In traditional network models, everything inside the perimeter firewall is trusted implicitly. However, if a single service is compromised, malicious actors can move laterally across your network unchecked. Zero Trust eliminates implicit trust, requiring continuous authentication and verification at every layer.</p>
<h3>Implementing Microsegmentation</h3>
<p>By enforcing strict ingress and egress network security policies inside your Kubernetes cluster, you isolate service boundaries. For example, your public-facing frontend microservice should never be allowed to communicate directly with your main transactional databases.</p>
<h3>Mutual TLS (mTLS) by Default</h3>
<p>Using service meshes like Istio or Linkerd, every single API call between your services is encrypted and mutually authenticated via short-lived TLS certificates, keeping internal communications completely secure.</p>`,
    cover_image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    read_time: '8 min read',
    read_time_minutes: 8,
    category: 'Security',
    author_name: 'Rahul Sen',
    author_image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    author_avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    author_designation: 'Principal Security Analyst',
    published_date: 'Jun 23, 2026',
    published_at: 'Jun 23, 2026',
    display_order: 4,
    is_active: true
  },
  {
    id: 'art_5',
    title: 'Event-Driven Systems: Transitioning from Monolith to Event Sourcing',
    description: 'Learn structural principles of event sourcing, CQRS patterns, and highly resilient stream ingestion using Apache Kafka.',
    excerpt: 'Learn structural principles of event sourcing, CQRS patterns, and highly resilient stream ingestion using Apache Kafka.',
    content: `<h2>Moving Beyond Relational CRUD</h2>
<p>Traditional monolithic applications store state exclusively in relational database tables. However, as organizations scale, tracking complex histories and high-concurrency writes becomes a major bottleneck. Event Sourcing models state as a chronological sequence of immutable events.</p>
<h3>The Power of CQRS</h3>
<p>Command Query Responsibility Segregation (CQRS) splits your system into write-optimized services (commands) and read-optimized services (queries). This prevents slow search query routines from locking up database write transactions.</p>
<h3>Stream Processing with Apache Kafka</h3>
<p>By using Kafka as your distributed write-ahead log, you create a fault-tolerant system capable of ingest rates in the millions of messages per second, enabling real-time stream processing, live dashboards, and robust microservices integration.</p>`,
    cover_image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    read_time: '6 min read',
    read_time_minutes: 6,
    category: 'Architecture',
    author_name: 'Meera Deshpande',
    author_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    author_designation: 'Chief Systems Architect',
    published_date: 'Jun 24, 2026',
    published_at: 'Jun 24, 2026',
    display_order: 5,
    is_active: true
  },
  {
    id: 'art_6',
    title: 'Advanced React 19 Hydration Patterns and Server Actions',
    description: 'Master React 19 server-side rendering updates, concurrent transitions, streaming HTML, and robust partial state hydrations.',
    excerpt: 'Master React 19 server-side rendering updates, concurrent transitions, streaming HTML, and robust partial state hydrations.',
    content: `<h2>Hydration and Performance in React 19</h2>
<p>React 19 brings some of the most fundamental shifts in frontend architecture since React hooks. At the center of these changes are deep performance optimizations around how server-rendered markup is hydrated in the client browser.</p>
<h3>Server Actions and Progressive Enhancement</h3>
<p>React 19 Server Actions allow developers to pass client-side form submissions directly to asynchronous server functions. This enables progressive enhancement, where forms are fully interactive and functional even before JavaScript has completed loading on the page.</p>
<h3>Streaming HTML and Suspense</h3>
<p>By leveraging HTML streaming, your server can send critical components (like headers and primary content) first, and stream delayed heavy components (like tables or charts) as soon as they finish generating, dramatically improving perceived site speed.</p>`,
    cover_image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    read_time: '5 min read',
    read_time_minutes: 5,
    category: 'Engineering',
    author_name: 'Vikram Joshi',
    author_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    author_designation: 'Staff Frontend Engineer',
    published_date: 'Jun 25, 2026',
    published_at: 'Jun 25, 2026',
    display_order: 6,
    is_active: true
  },
  {
    id: 'art_7',
    title: 'Fine-Tuning Small Language Models (SLMs) for Edge Deployment',
    description: 'How to distill knowledge from large models to lightweight edge models running locally on mobile devices and IoT.',
    excerpt: 'How to distill knowledge from large models to lightweight edge models running locally on mobile devices and IoT.',
    content: `<h2>The Edge AI Paradigm</h2>
<p>Hosting large-scale AI models in the cloud is expensive and introduces network latency. Small Language Models (SLMs) with 1B to 3B parameters can now be fine-tuned to perform highly specialized tasks (such as sentiment analysis or query parsing) directly on local consumer devices.</p>
<h3>Knowledge Distillation Explained</h3>
<p>Knowledge distillation is a machine learning process where a lightweight "student" model is trained to mimic the behavior and outputs of a massive "teacher" model (like Gemini 1.5 Pro). This preserves the majority of the reasoning power while reducing the hardware requirements by orders of magnitude.</p>
<h3>Quantization for Mobile Chipsets</h3>
<p>By converting 32-bit floating-point weights to 8-bit or 4-bit integers, developers can run models locally on edge chipsets with minimal loss in accuracy and minimal power consumption.</p>`,
    cover_image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    read_time: '9 min read',
    read_time_minutes: 9,
    category: 'AI & Machine Learning',
    author_name: 'Dr. Sarah Jenkins',
    author_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    author_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    author_designation: 'ML Research Lead',
    published_date: 'Jun 26, 2026',
    published_at: 'Jun 26, 2026',
    display_order: 7,
    is_active: true
  },
  {
    id: 'art_8',
    title: 'DevSecOps Blueprint: Automating Vulnerability Scans in CI/CD Pipelines',
    description: 'Integrate automatic static application security testing (SAST), secrets detection, and container scanners cleanly into GitHub Actions CI.',
    excerpt: 'Integrate automatic static application security testing (SAST), secrets detection, and container scanners cleanly into GitHub Actions CI.',
    content: `<h2>Automating Security in CI/CD</h2>
<p>Waiting for manual audits or quarterly security reviews to find security holes is a recipe for disaster. High-performing engineering groups embed security automated tests directly into their continuous integration (CI) workflows, a practice known as DevSecOps.</p>
<h3>Static Analysis (SAST) and Dependency Auditing</h3>
<p>Automate security scanning on every Git push. Tools like SonarQube, Snyk, and npm-audit analyze your source code for common anti-patterns (such as SQL injection vectors or insecure packages) before code is merged into production branches.</p>
<h3>Detecting Hardcoded Secrets</h3>
<p>Integrate secret scanning tools like GitGuardian or gitleaks into your pipelines to prevent developers from accidentally committing database passwords, AWS credentials, or API keys to public repositories.</p>`,
    cover_image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&q=80',
    read_time: '6 min read',
    read_time_minutes: 6,
    category: 'Security',
    author_name: 'Arjun Mehta',
    author_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    author_designation: 'DevSecOps Specialist',
    published_date: 'Jun 27, 2026',
    published_at: 'Jun 27, 2026',
    display_order: 8,
    is_active: true
  }
];

const defaultArticleCategories: ArticleCategory[] = [
  { id: 'cat_1', name: 'All Articles', icon: 'BookOpen', display_order: 1 },
  { id: 'cat_2', name: 'Cloud & DevOps', icon: 'Cloud', display_order: 2 },
  { id: 'cat_3', name: 'AI & Machine Learning', icon: 'Cpu', display_order: 3 },
  { id: 'cat_4', name: 'Security', icon: 'Shield', display_order: 4 },
  { id: 'cat_5', name: 'Architecture', icon: 'Layout', display_order: 5 },
  { id: 'cat_6', name: 'Engineering', icon: 'Settings', display_order: 6 }
];

const defaultArticleStatistics: ArticleStatistic[] = [
  { id: 'stat_1', label: 'Articles Published', value: '250+', icon: 'BookOpen', display_order: 1 },
  { id: 'stat_2', label: 'Expert Authors', value: '50+', icon: 'Users', display_order: 2 },
  { id: 'stat_3', label: 'Monthly Readers', value: '120K+', icon: 'Eye', display_order: 3 },
  { id: 'stat_4', label: 'Resource Downloads', value: '15K+', icon: 'Download', display_order: 4 },
  { id: 'stat_5', label: 'Reader Rating', value: '4.8/5', icon: 'Star', display_order: 5 }
];

const defaultBlogs: BlogPost[] = [
  {
    id: 'blog_1',
    title: 'Demystifying Serverless Architectures for Enterprise Platforms',
    slug: 'demystifying-serverless-enterprise',
    content: `<h2>The Rise of Serverless</h2>\n<p>For decades, enterprise platforms were hosted on massive, heavy server architectures that required persistent care and feeding from IT teams. If a system experienced a traffic surge, servers crashed. If traffic slumped, companies overpaid for unused CPU hours. Serverless computing completely rewrites this calculus.</p>\n<h3>What is Serverless?</h3>\n<p>Contrary to its name, servers are still involved, but the developer never has to provision, manage, or patch them. Code is packaged into functional execution routes (like AWS Lambda, Google Cloud Functions, or Cloud Run) that boot up dynamically when triggered, perform their task, and instantly scale back down to zero.</p>\n<h3>Why Enterprises are Migrating</h3>\n<ol>\n<li><strong>Zero idle overhead:</strong> Pay exclusively for the exact milliseconds your code runs.</li>\n<li><strong>Auto-scalability:</strong> Instantly handle 10 requests or 10,000,000 requests without manual scaling intervention.</li>\n<li><strong>Developer Focus:</strong> Spend hours writing core business logic instead of debugging OS versions.</li>\n</ol>`,
    excerpt: 'Explore how serverless models help businesses reduce infrastructure cost to zero during idle periods, while instantly scaling to handle sudden millions of requests.',
    category: 'Cloud & DevOps',
    tags: ['Serverless', 'AWS', 'Kubernetes', 'Enterprise'],
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop&q=80',
    featured: true,
    seoTitle: 'Enterprise Serverless Architectures Guide - Zentriya IT',
    seoDescription: 'Master serverless migrations. Learn how AWS Lambda, Serverless containers, and Cloud Run optimize enterprise IT budget and system scale.',
    author: 'Dr. Anand Kumar',
    createdAt: '2026-06-18T14:22:00Z'
  },
  {
    id: 'blog_2',
    title: 'The AI Revolution: Integrating Custom LLM APIs Safely into Corporate Systems',
    slug: 'integrating-custom-llm-apis-safely',
    content: `<h2>Enterprise AI Integration</h2>\n<p>Generative Artificial Intelligence is transforming productivity. From custom customer service agents to smart internal search tools, companies are eager to harness LLM models like Gemini. However, simply copy-pasting API keys into public frontends is a massive security hazard.</p>\n<h3>The Risk: Exposed Keys & Data Leakage</h3>\n<p>If an API key is shipped in client-side code, anyone can inspect the browser devtools, steal the key, and rack up thousands of dollars of costs. Furthermore, uploading sensitive corporate intellectual property into generic public AI models risks training public networks on your proprietary information.</p>\n<h3>The Solution: Server-Side Proxies & Private Endpoints</h3>\n<p>To safely utilize AI capabilities, enterprises must route all LLM requests through secure, authenticated backend APIs, utilizing environment secrets. In this article, we outline best practices for engineering high-integrity, rate-limited, and safe AI middleware layers.</p>`,
    excerpt: 'Learn the essential security architectures required to proxy Generative AI services safely without exposing developer keys or risking IP data leaks.',
    category: 'Artificial Intelligence',
    tags: ['Generative AI', 'Gemini API', 'Security', 'React'],
    imageUrl: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&h=500&fit=crop&q=80',
    featured: false,
    seoTitle: 'Secure AI API Integrations in Corporate Systems - Zentriya IT',
    seoDescription: 'Ensure high-integrity data handling. Architect server-side proxies to call Gemini and OpenAI safely from your React web apps.',
    author: 'Er. Suresh Deshmukh',
    createdAt: '2026-06-20T09:15:00Z'
  }
];


const defaultFaqs: FaqItem[] = [
  { id: 'faq_1', question: 'Does Zentriya offer a placement guarantee for interns?', answer: 'We offer a comprehensive 100% placement referral and coordination program. Students who successfully complete their project assignments, pass our internal coding reviews, and participate in mock interviews get active referrals to our partner network of 120+ software agencies.', category: 'Internships' },
  { id: 'faq_2', question: 'What is the format of the Internship Programs?', answer: 'We offer both Hybrid and fully Online formats. Our Hybrid model in Bangalore includes dedicated physical labs, physical face-to-face mentor check-ins, and collaborative hackathons. The Online model is handled via Slack, video sync stands, and direct GitHub branch code reviews.', category: 'Internships' },
  { id: 'faq_3', question: 'Can we customize the company software consulting services?', answer: 'Absolutely. Zentriya is a fully dynamic custom consulting agency. We conduct comprehensive discovery sessions to understand your scaling metrics, cloud architectures, database structures, and security protocols, outputting precise custom milestone charts and competitive quotes.', category: 'Services' },
  { id: 'faq_4', question: 'Are the global certificates globally recognized?', answer: 'Yes. Zentriya provides training alignment with accredited global authorities (such as AWS, Azure, ISO, and Scrum Alliance). Certificates issued bear our registered corporate seals and specific verifiable QR-codes linked to student project repos.', category: 'Certifications' }
];

const defaultWhyChooseUs: WhyChooseUsItem[] = [
  {
    id: 'wcu_01',
    title: 'Industry-Oriented Training with Real-Time Practical Exposure',
    icon: 'Lightbulb',
    display_order: 1,
    is_active: true,
    description: 'Hands-on training with live industry projects and practical exposure.',
    bottom_badge: 'Live Projects'
  },
  {
    id: 'wcu_02',
    title: 'Strong Placement Support through MNC & Academic Collaborations',
    icon: 'Target',
    display_order: 2,
    is_active: true,
    description: 'Dedicated placement guidance through industry collaborations and career mentoring.',
    bottom_badge: 'Placement Support'
  },
  {
    id: 'wcu_03',
    title: 'Innovation-Driven Learning with Internships, Workshops & Hackathons',
    icon: 'TrendingUp',
    display_order: 3,
    is_active: true,
    description: 'Learn through internships, workshops, hackathons, and real-world case studies.',
    bottom_badge: 'Industry Mentors'
  }
];

const defaultStudentJourneySteps: StudentJourneyStep[] = [
  { id: 'sj_1', title: 'Registration', description: 'Register and consult with our career advisors to choose the right technology track matching your aspirations.', icon: 'UserPlus', display_order: 1, is_active: true },
  { id: 'sj_2', title: 'Training & Skill Development', description: 'Undergo rigorous, hands-on, live interactive training sessions led by seasoned principal architects and mentors.', icon: 'BookOpen', display_order: 2, is_active: true },
  { id: 'sj_3', title: 'Live Internship', description: 'Get onboarded onto active enterprise developer internship roles with real corporate standards and metrics.', icon: 'Briefcase', display_order: 3, is_active: true },
  { id: 'sj_4', title: 'Real-Time Projects', description: 'Build production-ready projects, work with Git, Docker, CI/CD pipelines, and experience true enterprise-grade development.', icon: 'Terminal', display_order: 4, is_active: true },
  { id: 'sj_5', title: 'Certification', description: 'Earn industry-recognized corporate certifications highlighting your verified practical skills and project experience.', icon: 'Award', display_order: 5, is_active: true },
  { id: 'sj_6', title: 'Placement Assistance', description: 'Unlock direct recruitment channels, portfolio profiling, mock interviews, and land placements with leading tech companies.', icon: 'TrendingUp', display_order: 6, is_active: true }
];

const defaultIndustryPartners: IndustryPartner[] = [
  {
    id: 'partner_01',
    company_name: 'Microsoft',
    logo: 'https://logo.clearbit.com/microsoft.com',
    website_url: 'https://www.microsoft.com',
    display_order: 1,
    is_active: true
  },
  {
    id: 'partner_02',
    company_name: 'Google',
    logo: 'https://logo.clearbit.com/google.com',
    website_url: 'https://www.google.com',
    display_order: 2,
    is_active: true
  },
  {
    id: 'partner_03',
    company_name: 'Amazon Web Services (AWS)',
    logo: 'https://logo.clearbit.com/amazon.com',
    website_url: 'https://aws.amazon.com',
    display_order: 3,
    is_active: true
  },
  {
    id: 'partner_04',
    company_name: 'IBM',
    logo: 'https://logo.clearbit.com/ibm.com',
    website_url: 'https://www.ibm.com',
    display_order: 4,
    is_active: true
  },
  {
    id: 'partner_05',
    company_name: 'Infosys',
    logo: 'https://logo.clearbit.com/infosys.com',
    website_url: 'https://www.infosys.com',
    display_order: 5,
    is_active: true
  },
  {
    id: 'partner_06',
    company_name: 'Tata Consultancy Services (TCS)',
    logo: 'https://logo.clearbit.com/tcs.com',
    website_url: 'https://www.tcs.com',
    display_order: 6,
    is_active: true
  },
  {
    id: 'partner_07',
    company_name: 'Accenture',
    logo: 'https://logo.clearbit.com/accenture.com',
    website_url: 'https://www.accenture.com',
    display_order: 7,
    is_active: true
  },
  {
    id: 'partner_08',
    company_name: 'Cognizant',
    logo: 'https://logo.clearbit.com/cognizant.com',
    website_url: 'https://www.cognizant.com',
    display_order: 8,
    is_active: true
  },
  {
    id: 'partner_09',
    company_name: 'Wipro',
    logo: 'https://logo.clearbit.com/wipro.com',
    website_url: 'https://www.wipro.com',
    display_order: 9,
    is_active: true
  },
  {
    id: 'partner_10',
    company_name: 'Capgemini',
    logo: 'https://logo.clearbit.com/capgemini.com',
    website_url: 'https://www.capgemini.com',
    display_order: 10,
    is_active: true
  },
  {
    id: 'partner_11',
    company_name: 'Oracle',
    logo: 'https://logo.clearbit.com/oracle.com',
    website_url: 'https://www.oracle.com',
    display_order: 11,
    is_active: true
  },
  {
    id: 'partner_12',
    company_name: 'Cisco',
    logo: 'https://logo.clearbit.com/cisco.com',
    website_url: 'https://www.cisco.com',
    display_order: 12,
    is_active: true
  },
  {
    id: 'partner_13',
    company_name: 'Dell Technologies',
    logo: 'https://logo.clearbit.com/dell.com',
    website_url: 'https://www.dell.com',
    display_order: 13,
    is_active: true
  },
  {
    id: 'partner_14',
    company_name: 'HCLTech',
    logo: 'https://logo.clearbit.com/hcltech.com',
    website_url: 'https://www.hcltech.com',
    display_order: 14,
    is_active: true
  }
];


const defaultDownloads: DownloadItem[] = [
  { id: 'dl_1', title: 'Zentriya Corporate Brochure 2026', fileUrl: '#', category: 'Brochure', downloadsCount: 2450 },
  { id: 'dl_2', title: 'MERN Full-Stack Internship Syllabus PDF', fileUrl: '#', category: 'Syllabus', downloadsCount: 4210 },
  { id: 'dl_3', title: 'Corporate Placement Placement Report 2025', fileUrl: '#', category: 'Placement Report', downloadsCount: 1890 }
];

const defaultClientPartners: ClientPartnerLogo[] = [
  { id: 'logo_1', name: 'IBM Partner', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=85&fit=crop&q=80', type: 'Partner' },
  { id: 'logo_2', name: 'AWS Network', logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=85&fit=crop&q=80', type: 'Partner' },
  { id: 'logo_3', name: 'Infosys Client', logoUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150&h=85&fit=crop&q=80', type: 'Client' },
  { id: 'logo_4', name: 'Cognizant Client', logoUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=85&fit=crop&q=80', type: 'Client' }
];

const defaultPlacementStats: PlacementStat[] = [
  { id: 'p_1', studentName: 'Preeti Sharma', companyName: 'IBM India', packageLPA: 12.4, courseOrInternship: 'Full Stack Java Internship', studentPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&q=80' },
  { id: 'p_2', studentName: 'Aditya Hegde', companyName: 'Microsoft GTSC', packageLPA: 18.5, courseOrInternship: 'Cloud & DevOps Bootcamp', studentPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&q=80' },
  { id: 'p_3', studentName: 'Rohan Nambiar', companyName: 'Accenture', packageLPA: 8.2, courseOrInternship: 'Full Stack Web (MERN)', studentPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80' }
];

const defaultPlacements: Placement[] = [
  {
    id: 'place_1',
    student_name: 'Preeti Sharma',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=faces&q=80',
    company_name: 'IBM',
    company_logo: 'IBM',
    job_role: 'Full Stack Java Developer',
    degree: 'B.Tech (CSE)',
    batch: '2024 Batch',
    package: 12.4,
    show_package: true,
    placement_badge: 'Placed at IBM',
    display_order: 1,
    is_active: true
  },
  {
    id: 'place_2',
    student_name: 'Aditya Hegde',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=faces&q=80',
    company_name: 'Microsoft',
    company_logo: 'Microsoft',
    job_role: 'Cloud & DevOps Engineer',
    degree: 'B.Tech (IT)',
    batch: '2024 Batch',
    package: 18.5,
    show_package: true,
    placement_badge: 'Placed at Microsoft',
    display_order: 2,
    is_active: true
  },
  {
    id: 'place_3',
    student_name: 'Rohan Nambiar',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces&q=80',
    company_name: 'Accenture',
    company_logo: 'Accenture',
    job_role: 'Full Stack Web Developer',
    degree: 'B.Tech (CSE)',
    batch: '2024 Batch',
    package: 8.2,
    show_package: true,
    placement_badge: 'Placed at Accenture',
    display_order: 3,
    is_active: true
  }
];

const defaultActivityLogs: ActivityLog[] = [
  { id: 'act_1', userId: 'usr_admin', userName: 'Admin Chief', userRole: 'OWNER', action: 'System Initialization', details: 'Configured global system settings and loaded dynamic corporate database schemas.', timestamp: '2026-06-25T00:00:00Z' },
  { id: 'act_2', userId: 'usr_admin', userName: 'Admin Chief', userRole: 'OWNER', action: 'Syllabus Updated', details: 'Added new syllabus components to the MERN Full Stack internship model.', timestamp: '2026-06-25T02:15:00Z' }
];

const defaultNotifications: SystemNotification[] = [
  { id: 'not_1', title: 'New Job Application', message: 'Preeti Deshmukh applied for Senior Frontend Developer role.', type: 'success', isRead: false, createdAt: '2026-06-24T22:45:00Z' },
  { id: 'not_2', title: 'Contact Request Received', message: 'Suresh Bhat left an enterprise software consulting message.', type: 'info', isRead: false, createdAt: '2026-06-25T01:10:00Z' }
];

const defaultApplications: JobApplication[] = [
  {
    id: 'app_1',
    jobId: 'job_1',
    jobTitle: 'Senior Frontend Developer (React/TS)',
    fullName: 'Preeti Deshmukh',
    email: 'preeti.deshmukh@gmail.com',
    phone: '+91 99887 76655',
    experienceYears: 5,
    resumeUrl: '#',
    coverLetter: 'Hello HR, I have 5 years of intense React experience, specializing in virtualized tables and canvas setups. I would love to join Zentriyas enterprise teams.',
    status: 'Shortlisted',
    createdAt: '2026-06-24T22:45:00Z'
  }
];

const defaultContacts: ContactMessage[] = [
  {
    id: 'con_1',
    name: 'Suresh Bhat',
    email: 'suresh@innocorp.com',
    phone: '+91 91234 56789',
    subject: 'Enterprise Cloud ERP Consulting request',
    message: 'Hello, we are an enterprise product manufacturer and need to consult on migrating our multi-tenant MySQL databases into AWS with proper DevOps isolation. Let us set up a call.',
    isRead: false,
    createdAt: '2026-06-25T01:10:00Z'
  }
];

// Helper to load/save from localStorage
function getLocalData<T>(key: string, defaultValue: T): T {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultValue;
  }
}

function setLocalData<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ----------------------------------------------------------------------
// DATABASE OPERATIONS LAYER (DOCKS DUAL CLIENT MODE)
// ----------------------------------------------------------------------

export const db = {
  setMockFallback(value: boolean) {
    setMockFallback(value);
  },
  isMockFallbackActive(): boolean {
    return isMockFallbackActive();
  },
  async checkDatabaseConnection(): Promise<boolean> {
    return checkDatabaseConnection();
  },
  // --------------------------------------------------------------------
  // SETTINGS
  // --------------------------------------------------------------------
  async getSettings(): Promise<WebsiteSettings> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('website_settings').select('*');
        if (!error && data && data.length > 0) {
          const row = data[0];
          return {
            id: row.id,
            companyName: row.company_name,
            logoUrl: row.logo_url,
            faviconUrl: row.favicon_url,
            primaryColor: row.primary_color,
            secondaryColor: row.secondary_color,
            whatsappNumber: row.whatsapp_number,
            contactEmail: row.contact_email,
            contactPhones: row.contact_phones || [],
            address: row.address || '',
            googleMapEmbedUrl: row.google_map_embed_url || '',
            popupBannerUrl: row.popup_banner_url || '',
            popupBannerActive: row.popup_banner_active ?? false,
            announcementText: row.announcement_text || '',
            announcementActive: row.announcement_active ?? false,
            whyChooseUsTitle: row.why_choose_us_title || 'Why Choose Us?',
            socialLinks: row.social_links || {},
            seo: {
              metaTitle: row.seo_settings?.meta_title || row.seo_settings?.metaTitle || '',
              metaDescription: row.seo_settings?.meta_description || row.seo_settings?.metaDescription || '',
              metaKeywords: row.seo_settings?.meta_keywords || row.seo_settings?.metaKeywords || '',
              ogImage: row.seo_settings?.og_image || row.seo_settings?.ogImage || ''
            }
          } as WebsiteSettings;
        } else if (!error) {
          // Empty, let's seed website_settings
          const dbData = {
            id: '88888888-8888-8888-8888-888888888888',
            company_name: defaultSettings.companyName,
            logo_url: defaultSettings.logoUrl,
            favicon_url: defaultSettings.faviconUrl,
            primary_color: defaultSettings.primaryColor,
            secondary_color: defaultSettings.secondaryColor,
            whatsapp_number: defaultSettings.whatsappNumber,
            contact_email: defaultSettings.contactEmail,
            contact_phones: defaultSettings.contactPhones,
            address: defaultSettings.address,
            google_map_embed_url: defaultSettings.googleMapEmbedUrl,
            popup_banner_url: defaultSettings.popupBannerUrl,
            popup_banner_active: defaultSettings.popupBannerActive,
            announcement_text: defaultSettings.announcementText,
            announcement_active: defaultSettings.announcementActive,
            why_choose_us_title: defaultSettings.whyChooseUsTitle,
            social_links: defaultSettings.socialLinks,
            seo_settings: {
              meta_title: defaultSettings.seo.metaTitle,
              meta_description: defaultSettings.seo.metaDescription,
              meta_keywords: defaultSettings.seo.metaKeywords,
              og_image: defaultSettings.seo.ogImage
            }
          };
          await supabase.from('website_settings').insert(dbData);
          return { ...defaultSettings, id: dbData.id };
        }
      } catch (e) {
        console.warn('Failed to fetch website_settings:', e);
      }
    }
    return defaultSettings;
  },

  async updateSettings(settings: WebsiteSettings): Promise<WebsiteSettings> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const dbData = {
          company_name: settings.companyName,
          logo_url: settings.logoUrl,
          favicon_url: settings.faviconUrl,
          primary_color: settings.primaryColor,
          secondary_color: settings.secondaryColor,
          whatsapp_number: settings.whatsappNumber,
          contact_email: settings.contactEmail,
          contact_phones: settings.contactPhones,
          address: settings.address,
          google_map_embed_url: settings.googleMapEmbedUrl,
          popup_banner_url: settings.popupBannerUrl,
          popup_banner_active: settings.popupBannerActive,
          announcement_text: settings.announcementText,
          announcement_active: settings.announcementActive,
          why_choose_us_title: settings.whyChooseUsTitle,
          social_links: settings.socialLinks,
          seo_settings: {
            meta_title: settings.seo.metaTitle,
            meta_description: settings.seo.metaDescription,
            meta_keywords: settings.seo.metaKeywords,
            og_image: settings.seo.ogImage
          }
        };
        await supabase.from('website_settings').upsert({ id: ensureUuid(settings.id), ...dbData });
      } catch (e) {
        console.warn('Failed to update website_settings:', e);
      }
    }
    this.logActivity('Settings Modified', 'Global corporate contact, theme, and SEO fields updated.');
    return settings;
  },

  // --------------------------------------------------------------------
  // HERO SLIDES
  // --------------------------------------------------------------------
  async getHeroSlides(): Promise<HeroSlide[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('hero_slides').select('*').order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map(row => ({
            id: row.id,
            title: row.title,
            subtitle: row.subtitle,
            imageUrl: row.image_url,
            ctaText: row.cta_text || '',
            ctaLink: row.cta_link || '',
            order: row.display_order ?? 0
          })) as HeroSlide[];
        } else if (!error) {
          // Seeding
          const dbSlides = defaultHeroSlides.map(slide => ({
            id: ensureUuid(slide.id),
            title: slide.title,
            subtitle: slide.subtitle,
            image_url: slide.imageUrl,
            cta_text: slide.ctaText,
            cta_link: slide.ctaLink,
            display_order: slide.order,
            is_active: true
          }));
          await supabase.from('hero_slides').insert(dbSlides);
          return defaultHeroSlides.map(slide => ({ ...slide, id: ensureUuid(slide.id) }));
        }
      } catch (e) {
        console.warn('Failed to fetch hero_slides:', e);
      }
    }
    return defaultHeroSlides;
  },

  async saveHeroSlides(slides: HeroSlide[]): Promise<HeroSlide[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('hero_slides').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        const dbSlides = slides.map(slide => ({
          id: ensureUuid(slide.id),
          title: slide.title,
          subtitle: slide.subtitle,
          image_url: slide.imageUrl,
          cta_text: slide.ctaText,
          cta_link: slide.ctaLink,
          display_order: slide.order,
          is_active: true
        }));
        await supabase.from('hero_slides').insert(dbSlides);
      } catch (e) {
        console.warn('Failed to save hero_slides:', e);
      }
    }
    this.logActivity('Hero Slides Updated', `Reordered and updated ${slides.length} home banner slides.`);
    return slides;
  },

  // --------------------------------------------------------------------
  // ABOUT SECTION
  // --------------------------------------------------------------------
  async getAbout(): Promise<AboutSection> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('about_section').select('*');
        if (!error && data && data.length > 0) {
          const row = data[0];
          return {
            id: row.id,
            title: row.title,
            description: row.description,
            image: row.image_url,
            is_active: row.is_active,
            created_at: row.created_at,
            updated_at: row.updated_at
          } as AboutSection;
        } else if (!error) {
          // Seeding
          const dbAbout = {
            id: ensureUuid(defaultAbout.id),
            title: defaultAbout.title,
            description: defaultAbout.description,
            image_url: defaultAbout.image,
            is_active: defaultAbout.is_active
          };
          await supabase.from('about_section').insert(dbAbout);
          return { ...defaultAbout, id: dbAbout.id };
        }
      } catch (e) {
        console.warn('Failed to fetch about_section:', e);
      }
    }
    return defaultAbout;
  },

  async updateAbout(about: AboutSection): Promise<AboutSection> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const dbData = {
          title: about.title,
          description: about.description,
          image_url: about.image,
          is_active: about.is_active !== false
        };
        await supabase.from('about_section').upsert({ id: ensureUuid(about.id), ...dbData });
      } catch (e) {
        console.warn('Failed to update about_section:', e);
      }
    }
    this.logActivity('About Section Modified', 'Updated company vision, mission, and historic milestones.');
    return about;
  },

  // --------------------------------------------------------------------
  // SERVICES
  // --------------------------------------------------------------------
  async getServices(): Promise<ServiceItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('services').select('*').order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
            detailedDescription: row.detailed_description || '',
            icon: row.icon,
            imageUrl: row.image_url,
            features: row.features || [],
            benefits: row.benefits || [],
            order: row.display_order ?? 0,
            isActive: row.is_active ?? true,
            galleryUrls: []
          })) as ServiceItem[];
        }
        if (!error && data && data.length === 0) {
          try {
            const dbServices = defaultServices.map(s => ({
              id: ensureUuid(s.id),
              title: s.title,
              description: s.description,
              detailed_description: s.detailedDescription,
              icon: s.icon,
              image_url: s.imageUrl,
              features: s.features || [],
              benefits: s.benefits || [],
              display_order: s.order || 0,
              is_active: s.isActive !== false
            }));
            await supabase.from('services').insert(dbServices);
          } catch (e) {
            console.warn('Failed to seed services table:', e);
          }
          return defaultServices.map(s => ({ ...s, id: ensureUuid(s.id) }));
        }
      } catch (err) {
        console.warn('getServices error:', err);
      }
    }
    return defaultServices;
  },

  async saveService(service: ServiceItem): Promise<ServiceItem> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const dbData = {
          title: service.title,
          description: service.description,
          detailed_description: service.detailedDescription,
          icon: service.icon,
          image_url: service.imageUrl,
          features: service.features || [],
          benefits: service.benefits || [],
          display_order: service.order || 0,
          is_active: service.isActive !== false
        };
        await supabase.from('services').upsert({ id: ensureUuid(service.id), ...dbData });
      } catch (err) {
        console.warn('Failed to save service:', err);
      }
    }
    this.logActivity('Service Configured', `Created/Modified IT Service: "${service.title}".`);
    return service;
  },

  async deleteService(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('services').delete().eq('id', id);
    }
    this.logActivity('Service Removed', `Deleted service item reference. ID: ${id}`);
    return true;
  },

  async saveServices(services: ServiceItem[]): Promise<ServiceItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const dbData = services.map(s => ({
          id: ensureUuid(s.id),
          title: s.title,
          description: s.description,
          detailed_description: s.detailedDescription,
          icon: s.icon,
          image_url: s.imageUrl,
          features: s.features || [],
          benefits: s.benefits || [],
          display_order: s.order || 0,
          is_active: s.isActive !== false
        }));
        await supabase.from('services').upsert(dbData);
      } catch (err) {
        console.warn('Failed to save services:', err);
      }
    }
    this.logActivity('Services Reordered', 'Reordered Services directory items.');
    return services;
  },

  // --------------------------------------------------------------------
  // INTERNSHIP PROGRAMS
  // --------------------------------------------------------------------
  async getInternships(): Promise<InternshipProgram[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('internships').select('*');
        if (!error && data && data.length > 0) {
          return data as InternshipProgram[];
        }
        if (!error && data && data.length === 0) {
          try {
            await supabase.from('internships').insert(defaultInternships);
          } catch (e) {
            console.warn('Failed to seed internships table:', e);
          }
          return defaultInternships;
        }
      } catch (err) {
        console.warn('getInternships error:', err);
      }
    }
    return defaultInternships;
  },

  async saveInternship(internship: InternshipProgram): Promise<InternshipProgram> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('internships').upsert(internship);
    }
    this.logActivity('Internship Modified', `Syllabus/Pricing for "${internship.title}" updated.`);
    return internship;
  },

  async saveInternships(list: InternshipProgram[]): Promise<InternshipProgram[]> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('internships').upsert(list);
    }
    this.logActivity('Internships Reordered', 'Reordered internship items sequence.');
    return list;
  },

  async deleteInternship(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('internships').delete().eq('id', id);
    }
    this.logActivity('Internship Removed', `Deleted internship offering. ID: ${id}`);
    return true;
  },

  // --------------------------------------------------------------------
  // COURSES
  // --------------------------------------------------------------------
  async getCourses(): Promise<CourseItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('courses').select('*');
      if (!error && data && data.length > 0) {
        return data as CourseItem[];
      }
      if (!error && data && data.length === 0) {
        try {
          await supabase.from('courses').insert(defaultCourses);
        } catch (e) {
          console.warn('Failed to seed courses table:', e);
        }
        return defaultCourses;
      }
    }
    return defaultCourses;
  },

  async saveCourse(course: CourseItem): Promise<CourseItem> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('courses').upsert(course);
    }
    this.logActivity('Course Updated', `Enterprise training course "${course.title}" updated.`);
    return course;
  },

  async saveCourses(list: CourseItem[]): Promise<CourseItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('courses').upsert(list);
    }
    this.logActivity('Courses Reordered', 'Reordered courses items sequence.');
    return list;
  },

  async deleteCourse(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('courses').delete().eq('id', id);
    }
    this.logActivity('Course Deleted', `Deleted course item. ID: ${id}`);
    return true;
  },

  // --------------------------------------------------------------------
  // PROGRAMS
  // --------------------------------------------------------------------
  async getPrograms(): Promise<ProgramItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('programs').select('*').order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map(row => ({
            id: row.id,
            title: row.title,
            category: row.category,
            duration: row.duration,
            description: row.description,
            cover_image: row.cover_image,
            mode: row.mode,
            syllabus: Array.isArray(row.syllabus) ? row.syllabus : [],
            badges: Array.isArray(row.badges) ? row.badges : [],
            display_order: row.display_order ?? 0,
            is_active: row.is_active ?? true,
            created_at: row.created_at,
            updated_at: row.updated_at
          })) as ProgramItem[];
        }
        if (!error && data && data.length === 0) {
          try {
            const dbPrograms = defaultPrograms.map(p => ({
              id: ensureUuid(p.id),
              title: p.title,
              category: p.category,
              duration: p.duration,
              description: p.description,
              cover_image: p.cover_image,
              mode: p.mode,
              syllabus: p.syllabus || [],
              badges: p.badges || [],
              display_order: p.display_order,
              is_active: p.is_active !== false,
              price: 0
            }));
            await supabase.from('programs').insert(dbPrograms);
          } catch (e) {
            console.warn('Failed to seed programs table:', e);
          }
          return defaultPrograms.map(p => ({ ...p, id: ensureUuid(p.id) }));
        }
      } catch (err) {
        console.warn('getPrograms error:', err);
      }
    }
    return defaultPrograms;
  },

  async saveProgram(program: ProgramItem): Promise<ProgramItem> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const dbData = {
          title: program.title,
          category: program.category,
          duration: program.duration,
          description: program.description,
          cover_image: program.cover_image,
          mode: program.mode,
          syllabus: program.syllabus || [],
          badges: program.badges || [],
          display_order: program.display_order,
          is_active: program.is_active !== false,
          price: 0
        };
        await supabase.from('programs').upsert({ id: ensureUuid(program.id), ...dbData });
      } catch (err) {
        console.warn('Failed to save program:', err);
      }
    }
    this.logActivity('Program Modified', `Program offering "${program.title}" updated.`);
    return program;
  },

  async savePrograms(list: ProgramItem[]): Promise<ProgramItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const dbData = list.map(program => ({
          id: ensureUuid(program.id),
          title: program.title,
          category: program.category,
          duration: program.duration,
          description: program.description,
          cover_image: program.cover_image,
          mode: program.mode,
          syllabus: program.syllabus || [],
          badges: program.badges || [],
          display_order: program.display_order,
          is_active: program.is_active !== false,
          price: 0
        }));
        await supabase.from('programs').upsert(dbData);
      } catch (err) {
        console.warn('Failed to save programs:', err);
      }
    }
    this.logActivity('Programs Reordered', 'Reordered program offerings sequence.');
    return list;
  },

  async deleteProgram(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('programs').delete().eq('id', id);
    }
    this.logActivity('Program Removed', `Deleted program offering. ID: ${id}`);
    return true;
  },

  // --------------------------------------------------------------------
  // GALLERY & ALBUMS
  // --------------------------------------------------------------------
  async getGalleryAlbums(): Promise<GalleryAlbum[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('albums').select('*');
        if (!error && data && data.length > 0) {
          return data as GalleryAlbum[];
        }
      } catch (e) {
        console.warn('Failed to fetch albums from Supabase:', e);
      }
    }
    return defaultGalleryAlbums;
  },

  async saveGalleryAlbum(album: GalleryAlbum): Promise<GalleryAlbum> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('albums').upsert(album);
    }
    this.logActivity('Gallery Album Saved', `Created/Modified photo album "${album.title}".`);
    return album;
  },

  async deleteGalleryAlbum(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('albums').delete().eq('id', id);
    }
    return true;
  },

  async getGalleryItems(): Promise<GalleryItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('gallery').select('*').order('display_order', { ascending: true });
        if (error) {
          throw new Error(`getGalleryItems error: ${error.message}`);
        }
        if (data && data.length > 0) {
          return data.map(row => ({
            id: row.id,
            type: row.type || 'image',
            url: row.media_url,
            title: row.title,
            category: row.category
          })) as GalleryItem[];
        }
        if (data && data.length === 0) {
          try {
            const dbGallery = defaultGalleryItems.map(item => ({
              id: ensureUuid(item.id),
              title: item.title,
              category: item.category,
              type: item.type,
              media_url: item.url,
              display_order: 0,
              is_active: true
            }));
            await supabase.from('gallery').insert(dbGallery);
          } catch (e) {
            console.warn('Failed to seed gallery table:', e);
          }
          return defaultGalleryItems.map(item => ({ ...item, id: ensureUuid(item.id) }));
        }
      } catch (e) {
        console.warn('Failed to fetch gallery from Supabase:', e);
      }
    }
    return defaultGalleryItems;
  },

  async saveGalleryItem(item: GalleryItem): Promise<GalleryItem> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const dbData = {
          title: item.title,
          category: item.category,
          type: item.type,
          media_url: item.url,
          is_active: true
        };
        await supabase.from('gallery').upsert({ id: ensureUuid(item.id), ...dbData });
      } catch (err) {
        console.error('saveGalleryItem error:', err);
      }
    }
    return item;
  },

  async deleteGalleryItem(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('gallery').delete().eq('id', id);
    }
    return true;
  },

  // --------------------------------------------------------------------
  // TEAM MEMBERS
  // --------------------------------------------------------------------
  async getTeam(): Promise<TeamMember[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('team_members').select('*').order('display_order', { ascending: true });
        if (error) {
          throw new Error(`getTeam error: ${error.message}`);
        }
        if (data && data.length > 0) {
          return data.map(row => ({
            id: row.id,
            name: row.name,
            designation: row.designation,
            photoUrl: row.photo_url,
            bio: row.bio || '',
            socialLinks: {
              linkedin: row.social_links?.linkedin || '',
              twitter: row.social_links?.twitter || ''
            },
            order: row.display_order ?? 0
          })) as TeamMember[];
        }
        if (data && data.length === 0) {
          try {
            const dbTeam = defaultTeam.map(t => ({
              id: ensureUuid(t.id),
              name: t.name,
              designation: t.designation,
              photo_url: t.photoUrl,
              bio: t.bio || '',
              social_links: {
                linkedin: t.socialLinks?.linkedin || '',
                twitter: t.socialLinks?.twitter || ''
              },
              display_order: t.order || 0,
              is_active: true
            }));
            await supabase.from('team_members').insert(dbTeam);
          } catch (e) {
            console.warn('Failed to seed team_members table:', e);
          }
          return defaultTeam.map(t => ({ ...t, id: ensureUuid(t.id) }));
        }
      } catch (err) {
        console.warn('Failed to fetch team_members:', err);
      }
    }
    return defaultTeam;
  },

  async saveTeamMember(member: TeamMember): Promise<TeamMember> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const dbData = {
          name: member.name,
          designation: member.designation,
          photo_url: member.photoUrl,
          bio: member.bio || '',
          social_links: {
            linkedin: member.socialLinks?.linkedin || '',
            twitter: member.socialLinks?.twitter || ''
          },
          display_order: member.order || 0,
          is_active: true
        };
        await supabase.from('team_members').upsert({ id: ensureUuid(member.id), ...dbData });
      } catch (err) {
        console.warn('Failed to save team_member:', err);
      }
    }
    this.logActivity('Team Member Saved', `Added or updated team sheet for ${member.name}.`);
    return member;
  },

  async deleteTeamMember(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('team_members').delete().eq('id', id);
    }
    return true;
  },

  // --------------------------------------------------------------------
  // TESTIMONIALS
  // --------------------------------------------------------------------
  async getTestimonials(): Promise<TestimonialItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('testimonials').select('*').order('display_order', { ascending: true });
        if (error) {
          throw new Error(`getTestimonials error: ${error.message}`);
        }
        if (data && data.length > 0) {
          return data.map(row => ({
            id: row.id,
            name: row.name,
            rating: row.rating,
            companyOrCollege: row.company,
            company: row.company,
            designation: row.designation || '',
            type: row.type || 'Student',
            text: row.review_text,
            videoUrl: row.video_url || '',
            avatarUrl: row.avatar_url || '',
            linkedin: row.linkedin_url || '',
            is_verified: row.is_verified ?? true,
            display_order: row.display_order ?? 0,
            is_active: row.is_active ?? true,
            created_at: row.created_at,
            updated_at: row.updated_at
          })) as TestimonialItem[];
        }
        if (data && data.length === 0) {
          try {
            const dbTestimonials = defaultTestimonials.map(t => ({
              id: ensureUuid(t.id),
              name: t.name,
              avatar_url: t.avatarUrl || '',
              company: t.companyOrCollege || t.company || '',
              designation: t.designation || '',
              rating: t.rating || 5,
              type: t.type || 'Student',
              review_text: t.text || '',
              video_url: t.videoUrl || '',
              linkedin_url: t.linkedin || '',
              is_verified: t.is_verified !== false,
              display_order: t.display_order || 0,
              is_active: t.is_active !== false
            }));
            await supabase.from('testimonials').insert(dbTestimonials);
          } catch (e) {
            console.warn('Failed to seed testimonials table:', e);
          }
          return defaultTestimonials.map(t => ({ ...t, id: ensureUuid(t.id) }));
        }
      } catch (err) {
        console.warn('getTestimonials error:', err);
      }
    }
    return defaultTestimonials;
  },

  async saveTestimonial(testimonial: TestimonialItem): Promise<TestimonialItem> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const dbData = {
          name: testimonial.name,
          avatar_url: testimonial.avatarUrl || '',
          company: testimonial.companyOrCollege || testimonial.company || '',
          designation: testimonial.designation || '',
          rating: testimonial.rating || 5,
          type: testimonial.type || 'Student',
          review_text: testimonial.text || '',
          video_url: testimonial.videoUrl || '',
          linkedin_url: testimonial.linkedin || '',
          is_verified: testimonial.is_verified !== false,
          display_order: testimonial.display_order || 0,
          is_active: testimonial.is_active !== false
        };
        await supabase.from('testimonials').upsert({ id: ensureUuid(testimonial.id), ...dbData });
      } catch (err) {
        console.error('saveTestimonial error:', err);
      }
    }
    this.logActivity('Testimonial Added', `Saved review from "${testimonial.name}".`);
    return testimonial;
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('testimonials').delete().eq('id', id);
    }
    return true;
  },

  // --------------------------------------------------------------------
  // CAREERS & JOB LISTINGS
  // --------------------------------------------------------------------
  async getJobs(): Promise<JobListing[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('jobs').select('*').order('createdAt', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as JobListing[];
      }
      if (!error && data && data.length === 0) {
        try {
          await supabase.from('jobs').insert(defaultJobs);
        } catch (e) {
          console.warn('Failed to seed jobs table:', e);
        }
        return defaultJobs;
      }
    }
    return defaultJobs;
  },

  async saveJob(job: JobListing): Promise<JobListing> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('jobs').upsert(job);
    }
    this.logActivity('Career Job Configured', `Saved recruitment post for "${job.title}".`);
    return job;
  },

  async deleteJob(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('jobs').delete().eq('id', id);
    }
    return true;
  },

  // --------------------------------------------------------------------
  // APPLICATIONS
  // --------------------------------------------------------------------
  async getApplications(): Promise<JobApplication[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('applications').select('*').order('createdAt', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as JobApplication[];
      }
      if (!error && data && data.length === 0) {
        try {
          await supabase.from('applications').insert(defaultApplications);
        } catch (e) {
          console.warn('Failed to seed applications table:', e);
        }
        return defaultApplications;
      }
    }
    return defaultApplications;
  },

  async createApplication(app: JobApplication): Promise<JobApplication> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('applications').insert(app);
    }

    // Create system notification
    this.createNotification({
      id: 'not_' + Date.now(),
      title: 'New Job Application',
      message: `${app.fullName} applied for ${app.jobTitle}`,
      type: 'success',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    return app;
  },

  async updateApplicationStatus(id: string, status: JobApplication['status']): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('applications').update({ status }).eq('id', id);
    }
    this.logActivity('Application Processed', `Updated applicant status to ${status}.`);
    return true;
  },

  async deleteApplication(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('applications').delete().eq('id', id);
    }
    this.logActivity('Application Deleted', `Removed application reference. ID: ${id}`);
    return true;
  },

  // --------------------------------------------------------------------
  // CONTACT MESSAGES
  // --------------------------------------------------------------------
  async getContactMessages(): Promise<ContactMessage[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
        if (error) {
          throw new Error(`getContactMessages error: ${error.message}`);
        }
        if (data && data.length > 0) {
          return data.map(row => ({
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone || '',
            subject: row.subject || '',
            message: row.message,
            isRead: row.is_read ?? false,
            createdAt: row.created_at,
            notes: row.notes || ''
          })) as ContactMessage[];
        }
        if (data && data.length === 0) {
          try {
            const dbContacts = defaultContacts.map(c => ({
              id: ensureUuid(c.id),
              name: c.name,
              email: c.email,
              phone: c.phone || '',
              subject: c.subject || '',
              message: c.message,
              is_read: c.isRead ?? false,
              created_at: c.createdAt || new Date().toISOString()
            }));
            await supabase.from('contact_messages').insert(dbContacts);
          } catch (e) {
            console.warn('Failed to seed contact_messages table:', e);
          }
          return defaultContacts.map(c => ({ ...c, id: ensureUuid(c.id) }));
        }
      } catch (err) {
        console.warn('Failed to fetch contact_messages:', err);
      }
    }
    return defaultContacts;
  },

  async createContactMessage(msg: ContactMessage): Promise<ContactMessage> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const dbData = {
          name: msg.name,
          email: msg.email,
          phone: msg.phone || '',
          subject: msg.subject || '',
          message: msg.message,
          is_read: msg.isRead ?? false,
          created_at: msg.createdAt || new Date().toISOString()
        };
        await supabase.from('contact_messages').insert({ id: ensureUuid(msg.id), ...dbData });
      } catch (err) {
        console.error('Failed to insert contact_message:', err);
      }
    }

    // Notification
    this.createNotification({
      id: 'not_' + Date.now(),
      title: 'New Contact Message',
      message: `${msg.name} sent message: "${msg.subject}"`,
      type: 'info',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    return msg;
  },

  async markContactMessageRead(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('contact_messages').update({ is_read: true }).eq('id', ensureUuid(id));
      } catch (err) {
        console.error('Failed to mark read:', err);
      }
    }
    return true;
  },

  async deleteContactMessage(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('contact_messages').delete().eq('id', ensureUuid(id));
      } catch (err) {
        console.error('Failed to delete contact message:', err);
      }
    }
    this.logActivity('Contact Inquiry Deleted', `Removed support ticket ID: ${id}`);
    return true;
  },

  // --------------------------------------------------------------------
  // BLOG POSTS
  // --------------------------------------------------------------------
  async getBlogs(): Promise<BlogPost[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(row => ({
            id: row.id,
            title: row.title,
            slug: row.slug,
            content: row.content,
            excerpt: row.excerpt,
            category: row.category,
            tags: row.tags || [],
            imageUrl: row.cover_image_url,
            featured: row.is_featured,
            seoTitle: row.seo_title || '',
            seoDescription: row.seo_description || '',
            author: row.author_name,
            createdAt: row.created_at
          })) as BlogPost[];
        }
        if (!error && data && data.length === 0) {
          try {
            const dbBlogs = defaultBlogs.map(b => ({
              id: b.id,
              title: b.title,
              slug: b.slug,
              content: b.content,
              excerpt: b.excerpt,
              category: b.category,
              tags: b.tags || [],
              cover_image_url: b.imageUrl,
              is_featured: b.featured !== false,
              author_name: b.author,
              author_avatar_url: '/logo.png',
              author_designation: 'Editor',
              read_time_minutes: 5,
              seo_title: b.seoTitle || '',
              seo_description: b.seoDescription || '',
              is_active: true
            }));
            await supabase.from('blogs').insert(dbBlogs);
          } catch (e) {
            console.warn('Failed to seed blogs table:', e);
          }
          return defaultBlogs;
        }
      } catch (err) {
        console.warn('getBlogs error:', err);
      }
    }
    return defaultBlogs;
  },

  async saveBlogPost(post: BlogPost): Promise<BlogPost> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const dbData = {
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          category: post.category,
          tags: post.tags || [],
          cover_image_url: post.imageUrl,
          is_featured: post.featured !== false,
          author_name: post.author || 'Zentriya Admin',
          author_avatar_url: '/logo.png',
          author_designation: 'Administrator',
          read_time_minutes: Math.ceil(post.content.split(/\s+/).length / 200) || 5,
          seo_title: post.seoTitle || '',
          seo_description: post.seoDescription || '',
          is_active: true
        };
        await supabase.from('blogs').upsert({ id: post.id, ...dbData });
      } catch (err) {
        console.warn('Failed to save blog post:', err);
      }
    }
    this.logActivity('Blog Post Written', `Published blog post: "${post.title}".`);
    return post;
  },

  async deleteBlogPost(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('blogs').delete().eq('id', id);
    }
    return true;
  },

  // --------------------------------------------------------------------
  // FAQS
  // --------------------------------------------------------------------
  async getFaqs(): Promise<FaqItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('faqs').select('*');
        if (!error && data && data.length > 0) {
          return data as FaqItem[];
        }
        if (!error && data && data.length === 0) {
          try {
            await supabase.from('faqs').insert(defaultFaqs);
          } catch (e) {
            console.warn('Failed to seed faqs table:', e);
          }
          return defaultFaqs;
        }
      } catch (err) {
        console.warn('getFaqs error:', err);
      }
    }
    return defaultFaqs;
  },

  async saveFaq(faq: FaqItem): Promise<FaqItem> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('faqs').upsert(faq);
    }
    return faq;
  },

  async deleteFaq(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('faqs').delete().eq('id', id);
    }
    return true;
  },

  // --------------------------------------------------------------------
  // DOWNLOADS
  // --------------------------------------------------------------------
  async getDownloads(): Promise<DownloadItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('downloads').select('*');
        if (!error && data && data.length > 0) {
          return data as DownloadItem[];
        }
        if (!error && data && data.length === 0) {
          try {
            await supabase.from('downloads').insert(defaultDownloads);
          } catch (e) {
            console.warn('Failed to seed downloads table:', e);
          }
          return defaultDownloads;
        }
      } catch (err) {
        console.warn('getDownloads error:', err);
      }
    }
    return defaultDownloads;
  },

  async incrementDownload(id: string): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.rpc('increment_download_count', { item_id: id });
    }
  },

  // --------------------------------------------------------------------
  // PLACEMENT STATS & CLIENT PARTNERS
  // --------------------------------------------------------------------
  async getPlacementStats(): Promise<PlacementStat[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('placement_stats').select('*');
        if (!error && data && data.length > 0) {
          return data as PlacementStat[];
        }
        if (!error && data && data.length === 0) {
          try {
            await supabase.from('placement_stats').insert(defaultPlacementStats);
          } catch (e) {
            console.warn('Failed to seed placement_stats table:', e);
          }
          return defaultPlacementStats;
        }
      } catch (err) {
        console.warn('getPlacementStats error:', err);
      }
    }
    return defaultPlacementStats;
  },

  async savePlacementStat(stat: PlacementStat): Promise<PlacementStat> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('placement_stats').upsert(stat);
    }
    return stat;
  },

  async deletePlacementStat(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('placement_stats').delete().eq('id', id);
    }
    return true;
  },

  // Premium Placements (Dynamic Table)
  async getPlacements(): Promise<Placement[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('placements')
          .select('*')
          .order('display_order', { ascending: true });
        if (error) {
          throw new Error(`getPlacements error: ${error.message}`);
        }
        if (data && data.length > 0) {
          return data.map(row => ({
            id: row.id,
            student_name: row.student_name,
            photo: row.student_photo,
            company_name: row.company_name,
            company_logo: row.company_logo,
            job_role: row.job_role,
            degree: row.degree || '',
            batch: row.batch || '',
            package: row.package_lpa !== null ? Number(row.package_lpa) : undefined,
            show_package: row.show_package ?? true,
            placement_badge: row.placement_badge || '',
            display_order: row.display_order ?? 0,
            is_active: row.is_active ?? true,
            created_at: row.created_at,
            updated_at: row.updated_at
          })) as Placement[];
        }
        if (data && data.length === 0) {
          try {
            const dbPlacements = defaultPlacements.map(p => ({
              id: ensureUuid(p.id),
              student_name: p.student_name,
              student_photo: p.photo,
              company_name: p.company_name,
              company_logo: p.company_logo,
              job_role: p.job_role,
              degree: p.degree || '',
              batch: p.batch || '',
              package_lpa: p.package || null,
              show_package: p.show_package ?? true,
              placement_badge: p.placement_badge || '',
              display_order: p.display_order,
              is_active: p.is_active ?? true
            }));
            await supabase.from('placements').insert(dbPlacements);
          } catch (e) {
            console.warn('Failed to seed placements table:', e);
          }
          return defaultPlacements.map(p => ({ ...p, id: ensureUuid(p.id) }));
        }
      } catch (err) {
        console.warn('getPlacements error:', err);
      }
    }
    return defaultPlacements;
  },

  async savePlacement(placement: Placement): Promise<Placement> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const dbData = {
          student_name: placement.student_name,
          student_photo: placement.photo,
          company_name: placement.company_name,
          company_logo: placement.company_logo,
          job_role: placement.job_role,
          degree: placement.degree || '',
          batch: placement.batch || '',
          package_lpa: placement.package !== undefined ? Number(placement.package) : null,
          show_package: placement.show_package ?? true,
          placement_badge: placement.placement_badge || '',
          display_order: placement.display_order,
          is_active: placement.is_active ?? true
        };
        const { error } = await supabase.from('placements').upsert({ id: ensureUuid(placement.id), ...dbData });
        if (error) console.error('Supabase savePlacement failed:', error);
      } catch (err) {
        console.error('savePlacement exception:', err);
      }
    }
    return placement;
  },

  async deletePlacement(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('placements').delete().eq('id', id);
    }
    return true;
  },

  async reorderPlacements(items: Placement[]): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
      for (const item of items) {
        try {
          const dbData = {
            student_name: item.student_name,
            student_photo: item.photo,
            company_name: item.company_name,
            company_logo: item.company_logo,
            job_role: item.job_role,
            degree: item.degree || '',
            batch: item.batch || '',
            package_lpa: item.package !== undefined ? Number(item.package) : null,
            show_package: item.show_package ?? true,
            placement_badge: item.placement_badge || '',
            display_order: item.display_order,
            is_active: item.is_active ?? true
          };
          await supabase.from('placements').upsert({ id: ensureUuid(item.id), ...dbData });
        } catch (e) {
          console.error('Failed to reorder placements item:', e);
        }
      }
    }
  },

  async getClientPartners(): Promise<ClientPartnerLogo[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('client_partners').select('*');
        if (!error && data && data.length > 0) {
          return data as ClientPartnerLogo[];
        }
        if (!error && data && data.length === 0) {
          try {
            const dbCP = defaultClientPartners.map(cp => ({
              ...cp,
              id: ensureUuid(cp.id)
            }));
            await supabase.from('client_partners').insert(dbCP);
          } catch (e) {
            console.warn('Failed to seed client_partners table:', e);
          }
          return defaultClientPartners.map(cp => ({ ...cp, id: ensureUuid(cp.id) }));
        }
      } catch (err) {
        console.warn('getClientPartners error:', err);
      }
    }
    return defaultClientPartners;
  },

  async saveClientPartner(cp: ClientPartnerLogo): Promise<ClientPartnerLogo> {
    const supabase = getSupabase();
    if (supabase) {
      const dbCP = {
        ...cp,
        id: ensureUuid(cp.id)
      };
      await supabase.from('client_partners').upsert(dbCP);
    }
    return cp;
  },

  async deleteClientPartner(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('client_partners').delete().eq('id', id);
    }
    return true;
  },

  // --------------------------------------------------------------------
  // SYSTEM ACTIVITY LOGS & NOTIFICATIONS (PERSISTENT METRICS)
  // --------------------------------------------------------------------
  async getActivityLogs(): Promise<ActivityLog[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('activity_logs').select('*').order('timestamp', { ascending: false }).limit(50);
        if (!error && data && data.length > 0) {
          return data as ActivityLog[];
        }
        if (!error && data && data.length === 0) {
          try {
            await supabase.from('activity_logs').insert(defaultActivityLogs);
          } catch (e) {
            console.warn('Failed to seed activity_logs table:', e);
          }
          return defaultActivityLogs;
        }
      } catch (e) {
        console.warn('Supabase fetch failed for activity_logs:', e);
      }
    }
    return defaultActivityLogs;
  },

  async logActivity(action: string, details: string) {
    const activeUser = localStorage.getItem('zentriya_active_user');
    let user: UserProfile = { id: 'usr_admin', name: 'Admin Chief', email: 'admin@zentriya.com', role: 'Super Admin' as UserRole };
    if (activeUser) {
      try { user = JSON.parse(activeUser); } catch(e){}
    }
    const newLog: ActivityLog = {
      id: 'act_' + Date.now(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('activity_logs').insert(newLog);
      } catch (e) {
        console.warn('Supabase insert failed for activity_logs:', e);
      }
    }
  },

  async getNotifications(): Promise<SystemNotification[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('notifications').select('*').order('createdAt', { ascending: false }).limit(30);
        if (!error && data && data.length > 0) {
          return data as SystemNotification[];
        }
        if (!error && data && data.length === 0) {
          try {
            await supabase.from('notifications').insert(defaultNotifications);
          } catch (e) {
            console.warn('Failed to seed notifications table:', e);
          }
          return defaultNotifications;
        }
      } catch (e) {
        console.warn('Supabase fetch failed for notifications:', e);
      }
    }
    return defaultNotifications;
  },

  async createNotification(not: SystemNotification) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('notifications').insert(not);
      } catch (e) {
        console.warn('Supabase insert failed for notifications:', e);
      }
    }
  },

  async markNotificationRead(id: string): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('notifications').update({ isRead: true }).eq('id', id);
      } catch (e) {
        console.warn('Supabase update failed for notifications:', e);
      }
    }
  },

  // --------------------------------------------------------------------
  // WHY CHOOSE US
  // --------------------------------------------------------------------
  async getWhyChooseUs(): Promise<WhyChooseUsItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('why_choose_us').select('*').order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          return data as WhyChooseUsItem[];
        }
        if (!error && data && data.length === 0) {
          try {
            const dbItems = defaultWhyChooseUs.map(item => ({
              ...item,
              id: ensureUuid(item.id)
            }));
            await supabase.from('why_choose_us').insert(dbItems);
          } catch (e) {
            console.warn('Failed to seed why_choose_us table:', e);
          }
          return defaultWhyChooseUs.map(item => ({ ...item, id: ensureUuid(item.id) }));
        }
      } catch (e) {
        console.warn("Supabase query error:", e);
      }
    }
    return defaultWhyChooseUs;
  },

  async saveWhyChooseUsItem(item: WhyChooseUsItem): Promise<WhyChooseUsItem> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const dbData = {
          ...item,
          id: ensureUuid(item.id)
        };
        await supabase.from('why_choose_us').upsert(dbData);
      } catch (e) {
        console.warn("Supabase upsert warning:", e);
      }
    }
    return item;
  },

  async deleteWhyChooseUsItem(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('why_choose_us').delete().eq('id', id);
    }
    return true;
  },

  async saveWhyChooseUsOrder(items: WhyChooseUsItem[]): Promise<void> {
    const updated = items.map((item, idx) => ({
      ...item,
      id: ensureUuid(item.id),
      display_order: idx + 1
    }));
    const supabase = getSupabase();
    if (supabase) {
      for (const item of updated) {
        await supabase.from('why_choose_us').upsert(item);
      }
    }
  },

  // --------------------------------------------------------------------
  // STUDENT SUCCESS JOURNEY
  // --------------------------------------------------------------------
  async getStudentJourneySteps(): Promise<StudentJourneyStep[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('student_journey').select('*').order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data as StudentJourneyStep[];
      if (!error && data && data.length === 0) {
        try {
          await supabase.from('student_journey').insert(defaultStudentJourneySteps);
        } catch (e) {
          console.warn('Failed to seed student_journey table:', e);
        }
        return defaultStudentJourneySteps;
      }
    }
    return defaultStudentJourneySteps;
  },

  async saveStudentJourneyStep(step: StudentJourneyStep): Promise<StudentJourneyStep> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('student_journey').upsert(step);
    }
    return step;
  },

  async deleteStudentJourneyStep(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('student_journey').delete().eq('id', id);
    }
    return true;
  },

  async saveStudentJourneyStepOrder(items: StudentJourneyStep[]): Promise<void> {
    const updated = items.map((item, idx) => ({
      ...item,
      display_order: idx + 1
    }));
    const supabase = getSupabase();
    if (supabase) {
      for (const item of updated) {
        await supabase.from('student_journey').upsert(item);
      }
    }
  },

  // --------------------------------------------------------------------
  // INDUSTRY PARTNERS
  // --------------------------------------------------------------------
  async getIndustryPartners(): Promise<IndustryPartner[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('industry_network').select('*').order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map(row => ({
            id: row.id,
            company_name: row.company_name,
            logo: row.logo_url,
            website_url: row.website_url || '',
            display_order: row.display_order ?? 0,
            is_active: row.is_active
          })) as IndustryPartner[];
        }
        if (!error && data && data.length === 0) {
          try {
            const dbPartners = defaultIndustryPartners.map(p => ({
              id: ensureUuid(p.id),
              company_name: p.company_name,
              logo_url: p.logo,
              website_url: p.website_url || '',
              display_order: p.display_order,
              is_active: p.is_active
            }));
            await supabase.from('industry_network').insert(dbPartners);
          } catch (e) {
            console.warn('Failed to seed industry_network table:', e);
          }
          return defaultIndustryPartners.map(p => ({ ...p, id: ensureUuid(p.id) }));
        }
      } catch (e) {
        console.error('Supabase query failed:', e);
      }
    }
    return defaultIndustryPartners;
  },

  async saveIndustryPartner(partner: IndustryPartner): Promise<IndustryPartner> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const dbData = {
          company_name: partner.company_name,
          logo_url: partner.logo,
          website_url: partner.website_url || '',
          display_order: partner.display_order,
          is_active: partner.is_active
        };
        await supabase.from('industry_network').upsert({ id: ensureUuid(partner.id), ...dbData });
      } catch (err) {
        console.warn('Failed to save industry_network:', err);
      }
    }
    return partner;
  },

  async deleteIndustryPartner(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('industry_network').delete().eq('id', id);
      } catch (err) {
        console.warn('Failed to delete industry_network:', err);
      }
    }
    return true;
  },

  async saveIndustryPartnerOrder(items: IndustryPartner[]): Promise<void> {
    const updated = items.map((item, idx) => ({
      ...item,
      display_order: idx + 1
    }));
    const supabase = getSupabase();
    if (supabase) {
      try {
        for (const item of updated) {
          const dbData = {
            company_name: item.company_name,
            logo_url: item.logo,
            website_url: item.website_url || '',
            display_order: item.display_order,
            is_active: item.is_active
          };
          await supabase.from('industry_network').upsert({ id: item.id, ...dbData });
        }
      } catch (err) {
        console.warn('Failed to save industry_network order:', err);
      }
    }
  },

  // --------------------------------------------------------------------
  // TECH ARTICLES (SUPABASE MODE)
  // --------------------------------------------------------------------
  async getArticles(): Promise<Article[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('articles').select('*').order('display_order', { ascending: true });
        if (!error && data && data.length > 0) return data as Article[];
        if (!error && data && data.length === 0) {
          try {
            await supabase.from('articles').insert(defaultArticles);
          } catch (e) {
            console.warn('Failed to seed articles table:', e);
          }
          return defaultArticles;
        }
      } catch (e) {
        console.warn('Supabase query failed for articles:', e);
      }
    }
    return defaultArticles;
  },

  async saveArticle(article: Article): Promise<Article> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('articles').upsert(article);
      } catch (e) {
        console.warn('Supabase upsert failed for article:', e);
      }
    }
    this.logActivity('Article Saved', `Saved tech article: "${article.title}".`);
    return article;
  },

  async deleteArticle(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('articles').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete failed for article:', e);
      }
    }
    this.logActivity('Article Deleted', `Deleted tech article with ID: ${id}`);
    return true;
  },

  async saveArticlesOrder(items: Article[]): Promise<void> {
    const updated = items.map((item, idx) => ({
      ...item,
      display_order: idx + 1
    }));
    const supabase = getSupabase();
    if (supabase) {
      try {
        for (const item of updated) {
          await supabase.from('articles').upsert(item);
        }
      } catch (e) {
        console.warn('Supabase upsert order failed for articles:', e);
      }
    }
  },

  // --------------------------------------------------------------------
  // ARTICLE CATEGORIES (SUPABASE MODE)
  // --------------------------------------------------------------------
  async getArticleCategories(): Promise<ArticleCategory[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('article_categories').select('*').order('display_order', { ascending: true });
        if (!error && data && data.length > 0) return data as ArticleCategory[];
        if (!error && data && data.length === 0) {
          try {
            await supabase.from('article_categories').insert(defaultArticleCategories);
          } catch (e) {
            console.warn('Failed to seed article_categories table:', e);
          }
          return defaultArticleCategories;
        }
      } catch (e) {
        console.warn('Supabase query failed for article_categories:', e);
      }
    }
    return defaultArticleCategories;
  },

  async saveArticleCategory(category: ArticleCategory): Promise<ArticleCategory> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('article_categories').upsert(category);
      } catch (e) {
        console.warn('Supabase upsert failed for category:', e);
      }
    }
    return category;
  },

  async deleteArticleCategory(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('article_categories').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete failed for category:', e);
      }
    }
    return true;
  },

  // --------------------------------------------------------------------
  // ARTICLE STATISTICS (SUPABASE MODE)
  // --------------------------------------------------------------------
  async getArticleStatistics(): Promise<ArticleStatistic[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('article_statistics').select('*').order('display_order', { ascending: true });
        if (!error && data && data.length > 0) return data as ArticleStatistic[];
        if (!error && data && data.length === 0) {
          try {
            await supabase.from('article_statistics').insert(defaultArticleStatistics);
          } catch (e) {
            console.warn('Failed to seed article_statistics table:', e);
          }
          return defaultArticleStatistics;
        }
      } catch (e) {
        console.warn('Supabase query failed for article_statistics:', e);
      }
    }
    return defaultArticleStatistics;
  },

  async saveArticleStatistic(stat: ArticleStatistic): Promise<ArticleStatistic> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('article_statistics').upsert(stat);
      } catch (e) {
        console.warn('Supabase upsert failed for statistic:', e);
      }
    }
    return stat;
  },

  async deleteArticleStatistic(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('article_statistics').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete failed for statistic:', e);
      }
    }
    return true;
  },

  getDbConfig() {
    return getDbConfig();
  },

  saveDbConfig(config: DbConfig) {
    saveDbConfig(config);
  },

  backupData(): Record<string, any> {
    const backupKeys = [
      'zentriya_settings', 'zentriya_hero', 'zentriya_about', 'zentriya_services',
      'zentriya_internships', 'zentriya_courses', 'zentriya_albums', 'zentriya_gallery',
      'zentriya_team', 'zentriya_testimonials', 'zentriya_jobs', 'zentriya_applications',
      'zentriya_contacts', 'zentriya_blogs', 'zentriya_faqs', 'zentriya_downloads',
      'zentriya_placement_stats', 'zentriya_client_partners', 'zentriya_why_choose_us',
      'zentriya_student_journey', 'zentriya_industry_partners', 'zentriya_placements',
      'zentriya_articles', 'zentriya_article_categories', 'zentriya_article_statistics'
    ];
    const data: Record<string, any> = {};
    backupKeys.forEach(k => {
      const val = localStorage.getItem(k);
      if (val) {
        try {
          data[k] = JSON.parse(val);
        } catch (e) {
          data[k] = val;
        }
      }
    });
    return data;
  },

  restoreData(data: Record<string, any>): boolean {
    if (!data || typeof data !== 'object') return false;
    // Check for core keys to validate the upload
    if (!data['zentriya_settings']) {
      throw new Error('Invalid backup file format: Missing core zentriya settings.');
    }
    Object.keys(data).forEach(k => {
      if (k.startsWith('zentriya_')) {
        const val = data[k];
        localStorage.setItem(k, typeof val === 'string' ? val : JSON.stringify(val));
      }
    });
    return true;
  }
};
