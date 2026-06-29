import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  WebsiteSettings, HeroSlide, AboutSection, ServiceItem, 
  InternshipProgram, CourseItem, GalleryAlbum, GalleryItem, 
  TeamMember, TestimonialItem, JobListing, JobApplication, 
  ContactMessage, BlogPost, FaqItem, DownloadItem, 
  ClientPartnerLogo, PlacementStat, Placement, ActivityLog, SystemNotification, UserProfile, UserRole,
  WhyChooseUsItem, StudentJourneyStep, IndustryPartner
} from '../types';

// @ts-ignore
import workshopBanner from '../assets/images/workshop_banner_1782548250512.jpg';
// @ts-ignore
import groupPhoto from '../assets/images/group_photo_1782548265859.jpg';
// @ts-ignore
import presentationScreen from '../assets/images/presentation_screen_1782548285739.jpg';
// @ts-ignore
import awardTrophy from '../assets/images/award_trophy_1782548299290.jpg';
// @ts-ignore
import computerLabSession from '../assets/images/computer_lab_session_1782548312362.jpg';
// @ts-ignore
import landscapeVisualization from '../assets/images/landscape_visualization_1782548328367.jpg';
// @ts-ignore
import workshopOutdoorBanner from '../assets/images/workshop_outdoor_banner_1782549502724.jpg';
// @ts-ignore
import workshopSeminarAudience from '../assets/images/workshop_seminar_audience_1782549516586.jpg';

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
  const meta = import.meta as any;
  const url = localStorage.getItem(SUPABASE_URL_KEY) || (meta && meta.env && meta.env.VITE_SUPABASE_URL) || '';
  const anonKey = localStorage.getItem(SUPABASE_ANON_KEY) || (meta && meta.env && meta.env.VITE_SUPABASE_ANON_KEY) || '';
  const useMock = localStorage.getItem(USE_MOCK_DB_KEY) !== 'false'; // default to true to guarantee preview works first-time
  return { url, anonKey, useMock: useMock || !url || !anonKey };
}

export function saveDbConfig(config: DbConfig) {
  if (config.url) localStorage.setItem(SUPABASE_URL_KEY, config.url);
  else localStorage.removeItem(SUPABASE_URL_KEY);

  if (config.anonKey) localStorage.setItem(SUPABASE_ANON_KEY, config.anonKey);
  else localStorage.removeItem(SUPABASE_ANON_KEY);

  localStorage.setItem(USE_MOCK_DB_KEY, config.useMock ? 'true' : 'false');
  
  // Reload to apply changes
  window.location.reload();
}

// Lazy Supabase Client Initialization
let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const config = getDbConfig();
  if (config.useMock || !config.url || !config.anonKey) {
    return null;
  }
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey);
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
  }
];

const defaultGalleryAlbums: GalleryAlbum[] = [
  { id: 'album_workshop', title: '6-Day SketchUp Workshop 2026', description: 'Hands-on SketchUp and Landscape Design workshop at Bapatla Engineering College.', category: 'Workshops', coverImageUrl: workshopBanner },
  { id: 'album_lab', title: 'Interactive Practical Sessions', description: 'Students designing 3D landscapes in the computer laboratory.', category: 'Labs', coverImageUrl: computerLabSession },
  { id: 'album_achievements', title: 'Achievements & Awards', description: 'Award mementos and workshop certification ceremonies.', category: 'Achievements', coverImageUrl: awardTrophy }
];

const defaultGalleryItems: GalleryItem[] = [
  { id: 'gal_1', albumId: 'album_workshop', type: 'image', url: workshopBanner, title: 'Workshop Official Banner & Brochure', category: 'Workshops' },
  { id: 'gal_2', albumId: 'album_workshop', type: 'image', url: groupPhoto, title: 'Workshop Batch Group Portrait', category: 'Workshops' },
  { id: 'gal_3', albumId: 'album_workshop', type: 'image', url: presentationScreen, title: 'Landscape Design Presentation', category: 'Workshops' },
  { id: 'gal_4', albumId: 'album_achievements', type: 'image', url: awardTrophy, title: 'Award Trophy presented to Ms. K. Lakshmi Naga Valli', category: 'Achievements' },
  { id: 'gal_5', albumId: 'album_lab', type: 'image', url: computerLabSession, title: 'Practical SketchUp Modeling in Computer Lab', category: 'Labs' },
  { id: 'gal_6', albumId: 'album_lab', type: 'image', url: landscapeVisualization, title: 'Final 3D Landscape Design Rendering', category: 'Labs' },
  { id: 'gal_7', albumId: 'album_workshop', type: 'image', url: workshopOutdoorBanner, title: 'Workshop Outdoor Display Banner & Backdrop', category: 'Workshops' },
  { id: 'gal_8', albumId: 'album_workshop', type: 'image', url: workshopSeminarAudience, title: 'Interactive Seminar Session & Guest Lecture', category: 'Workshops' }
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
    is_active: true
  },
  {
    id: 'wcu_02',
    title: 'Strong Placement Support through MNC & Academic Collaborations',
    icon: 'Target',
    display_order: 2,
    is_active: true
  },
  {
    id: 'wcu_03',
    title: 'Innovation-Driven Learning with Internships, Workshops & Hackathons',
    icon: 'TrendingUp',
    display_order: 3,
    is_active: true
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
  // --------------------------------------------------------------------
  // SETTINGS
  // --------------------------------------------------------------------
  async getSettings(): Promise<WebsiteSettings> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('settings').select('*').single();
      if (!error && data) {
        const dbSettings = data as WebsiteSettings;
        if (dbSettings.contactEmail !== 'info.zentriya@gmail.com' || dbSettings.contactPhones?.length !== 3 || dbSettings.contactPhones?.[0] !== '+91 7989270174') {
          dbSettings.contactEmail = 'info.zentriya@gmail.com';
          dbSettings.contactPhones = ['+91 7989270174', '+91 95509 50705', '+91 6301550330'];
          dbSettings.whatsappNumber = '+917989270174';
          dbSettings.address = '';
          dbSettings.googleMapEmbedUrl = '';
        }
        if (!dbSettings.whyChooseUsTitle) {
          dbSettings.whyChooseUsTitle = 'Why Choose Us?';
        }
        return dbSettings;
      }
    }
    const settings = getLocalData<WebsiteSettings>('zentriya_settings', defaultSettings);
    if (settings.contactEmail !== 'info.zentriya@gmail.com' || settings.contactPhones?.length !== 3 || settings.contactPhones?.[0] !== '+91 7989270174' || settings.address !== '') {
      settings.contactEmail = 'info.zentriya@gmail.com';
      settings.contactPhones = ['+91 7989270174', '+91 95509 50705', '+91 6301550330'];
      settings.whatsappNumber = '+917989270174';
      settings.address = '';
      settings.googleMapEmbedUrl = '';
      setLocalData('zentriya_settings', settings);
    }
    if (!settings.whyChooseUsTitle) {
      settings.whyChooseUsTitle = 'Why Choose Us?';
      setLocalData('zentriya_settings', settings);
    }
    if (settings.logoUrl.includes('unsplash.com') || settings.logoUrl === '') {
      settings.logoUrl = '/logo.png';
      settings.faviconUrl = '/logo.png';
      setLocalData('zentriya_settings', settings);
    }
    return settings;
  },

  async updateSettings(settings: WebsiteSettings): Promise<WebsiteSettings> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('settings').upsert(settings);
    }
    setLocalData('zentriya_settings', settings);
    this.logActivity('Settings Modified', 'Global corporate contact, theme, and SEO fields updated.');
    return settings;
  },

  // --------------------------------------------------------------------
  // HERO SLIDES
  // --------------------------------------------------------------------
  async getHeroSlides(): Promise<HeroSlide[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('hero').select('*').order('order', { ascending: true });
      if (!error && data) return data as HeroSlide[];
    }
    return getLocalData<HeroSlide[]>('zentriya_hero', defaultHeroSlides).sort((a, b) => a.order - b.order);
  },

  async saveHeroSlides(slides: HeroSlide[]): Promise<HeroSlide[]> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('hero').delete().neq('id', 'keep_all');
      await supabase.from('hero').insert(slides);
    }
    setLocalData('zentriya_hero', slides);
    this.logActivity('Hero Slides Updated', `Reordered and updated ${slides.length} home banner slides.`);
    return slides;
  },

  // --------------------------------------------------------------------
  // ABOUT SECTION
  // --------------------------------------------------------------------
  async getAbout(): Promise<AboutSection> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('about').select('*').single();
      if (!error && data && data.title && data.description) return data as AboutSection;
    }
    const local = getLocalData<any>('zentriya_about', defaultAbout);
    if (!local || typeof local !== 'object' || !local.title || !local.description) {
      setLocalData('zentriya_about', defaultAbout);
      return defaultAbout;
    }
    return local as AboutSection;
  },

  async updateAbout(about: AboutSection): Promise<AboutSection> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('about').upsert(about);
    }
    setLocalData('zentriya_about', about);
    this.logActivity('About Section Modified', 'Updated company vision, mission, and historic milestones.');
    return about;
  },

  // --------------------------------------------------------------------
  // SERVICES
  // --------------------------------------------------------------------
  async getServices(): Promise<ServiceItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('services').select('*').order('order', { ascending: true });
      if (!error && data) return data as ServiceItem[];
    }
    const list = getLocalData<ServiceItem[]>('zentriya_services', defaultServices);
    if (list.length < 7 || !list.some(s => s.id === 'service_7')) {
      setLocalData('zentriya_services', defaultServices);
      return defaultServices;
    }
    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  async saveService(service: ServiceItem): Promise<ServiceItem> {
    const services = await this.getServices();
    const index = services.findIndex(s => s.id === service.id);
    if (index >= 0) {
      services[index] = service;
    } else {
      services.push(service);
    }
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('services').upsert(service);
    }
    setLocalData('zentriya_services', services);
    this.logActivity('Service Configured', `Created/Modified IT Service: "${service.title}".`);
    return service;
  },

  async deleteService(id: string): Promise<boolean> {
    const services = await this.getServices();
    const filtered = services.filter(s => s.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('services').delete().eq('id', id);
    }
    setLocalData('zentriya_services', filtered);
    this.logActivity('Service Removed', `Deleted service item reference. ID: ${id}`);
    return true;
  },

  async saveServices(services: ServiceItem[]): Promise<ServiceItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('services').upsert(services);
    }
    setLocalData('zentriya_services', services);
    this.logActivity('Services Reordered', 'Reordered Services directory items.');
    return services;
  },

  // --------------------------------------------------------------------
  // INTERNSHIP PROGRAMS
  // --------------------------------------------------------------------
  async getInternships(): Promise<InternshipProgram[]> {
    const supabase = getSupabase();
    let list: InternshipProgram[] = [];
    if (supabase) {
      const { data, error } = await supabase.from('internships').select('*');
      if (!error && data) {
        list = data as InternshipProgram[];
      }
    }
    if (!list || list.length === 0) {
      list = getLocalData<InternshipProgram[]>('zentriya_internships', defaultInternships);
    }
    return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  },

  async saveInternship(internship: InternshipProgram): Promise<InternshipProgram> {
    const internships = await this.getInternships();
    const index = internships.findIndex(i => i.id === internship.id);
    if (index >= 0) {
      internships[index] = internship;
    } else {
      if (internship.order === undefined) {
        internship.order = internships.length;
      }
      internships.push(internship);
    }
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('internships').upsert(internship);
    }
    setLocalData('zentriya_internships', internships);
    this.logActivity('Internship Modified', `Syllabus/Pricing for "${internship.title}" updated.`);
    return internship;
  },

  async saveInternships(list: InternshipProgram[]): Promise<InternshipProgram[]> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('internships').upsert(list);
    }
    setLocalData('zentriya_internships', list);
    this.logActivity('Internships Reordered', 'Reordered internship items sequence.');
    return list;
  },

  async deleteInternship(id: string): Promise<boolean> {
    const internships = await this.getInternships();
    const filtered = internships.filter(i => i.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('internships').delete().eq('id', id);
    }
    setLocalData('zentriya_internships', filtered);
    this.logActivity('Internship Removed', `Deleted internship offering. ID: ${id}`);
    return true;
  },

  // --------------------------------------------------------------------
  // COURSES
  // --------------------------------------------------------------------
  async getCourses(): Promise<CourseItem[]> {
    const supabase = getSupabase();
    let list: CourseItem[] = [];
    if (supabase) {
      const { data, error } = await supabase.from('courses').select('*');
      if (!error && data) {
        list = data as CourseItem[];
      }
    }
    if (!list || list.length === 0) {
      list = getLocalData<CourseItem[]>('zentriya_courses', defaultCourses);
      // Self-healing: Reset local cache if it is old
      if (list.length < 3 || list.some(c => c.title.includes('React & TypeScript') || c.id === 'course_1' && c.title !== 'Full Stack Web Development')) {
        list = defaultCourses;
        setLocalData('zentriya_courses', defaultCourses);
      }
    }
    return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  },

  async saveCourse(course: CourseItem): Promise<CourseItem> {
    const courses = await this.getCourses();
    const index = courses.findIndex(c => c.id === course.id);
    if (index >= 0) {
      courses[index] = course;
    } else {
      if (course.order === undefined) {
        course.order = courses.length;
      }
      courses.push(course);
    }
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('courses').upsert(course);
    }
    setLocalData('zentriya_courses', courses);
    this.logActivity('Course Updated', `Enterprise training course "${course.title}" updated.`);
    return course;
  },

  async saveCourses(list: CourseItem[]): Promise<CourseItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('courses').upsert(list);
    }
    setLocalData('zentriya_courses', list);
    this.logActivity('Courses Reordered', 'Reordered courses items sequence.');
    return list;
  },

  async deleteCourse(id: string): Promise<boolean> {
    const courses = await this.getCourses();
    const filtered = courses.filter(c => c.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('courses').delete().eq('id', id);
    }
    setLocalData('zentriya_courses', filtered);
    this.logActivity('Course Deleted', `Deleted course item. ID: ${id}`);
    return true;
  },

  // --------------------------------------------------------------------
  // GALLERY & ALBUMS
  // --------------------------------------------------------------------
  async getGalleryAlbums(): Promise<GalleryAlbum[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('albums').select('*');
      if (!error && data) return data as GalleryAlbum[];
    }
    const albums = getLocalData<GalleryAlbum[]>('zentriya_albums', defaultGalleryAlbums);
    if (albums.some(a => a.id === 'album_1' || a.coverImageUrl.includes('unsplash.com'))) {
      setLocalData('zentriya_albums', defaultGalleryAlbums);
      return defaultGalleryAlbums;
    }
    return albums;
  },

  async saveGalleryAlbum(album: GalleryAlbum): Promise<GalleryAlbum> {
    const albums = await this.getGalleryAlbums();
    const index = albums.findIndex(a => a.id === album.id);
    if (index >= 0) albums[index] = album;
    else albums.push(album);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('albums').upsert(album);
    }
    setLocalData('zentriya_albums', albums);
    this.logActivity('Gallery Album Saved', `Created/Modified photo album "${album.title}".`);
    return album;
  },

  async deleteGalleryAlbum(id: string): Promise<boolean> {
    const albums = await this.getGalleryAlbums();
    const filtered = albums.filter(a => a.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('albums').delete().eq('id', id);
    }
    setLocalData('zentriya_albums', filtered);
    return true;
  },

  async getGalleryItems(): Promise<GalleryItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('gallery').select('*');
      if (!error && data) return data as GalleryItem[];
    }
    const items = getLocalData<GalleryItem[]>('zentriya_gallery', defaultGalleryItems);
    if (items.some(item => item.id === 'gal_1' && !item.url.includes('workshop_banner')) || items.length < 8 || items.some(item => item.url && item.url.includes('unsplash.5Fcom') || (item.url && item.url.includes('unsplash.com')))) {
      setLocalData('zentriya_gallery', defaultGalleryItems);
      return defaultGalleryItems;
    }
    return items;
  },

  async saveGalleryItem(item: GalleryItem): Promise<GalleryItem> {
    const items = await this.getGalleryItems();
    const index = items.findIndex(i => i.id === item.id);
    if (index >= 0) items[index] = item;
    else items.push(item);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('gallery').upsert(item);
    }
    setLocalData('zentriya_gallery', items);
    return item;
  },

  async deleteGalleryItem(id: string): Promise<boolean> {
    const items = await this.getGalleryItems();
    const filtered = items.filter(i => i.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('gallery').delete().eq('id', id);
    }
    setLocalData('zentriya_gallery', filtered);
    return true;
  },

  // --------------------------------------------------------------------
  // TEAM MEMBERS
  // --------------------------------------------------------------------
  async getTeam(): Promise<TeamMember[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('team').select('*').order('order', { ascending: true });
      if (!error && data) return data as TeamMember[];
    }
    return getLocalData<TeamMember[]>('zentriya_team', defaultTeam).sort((a, b) => a.order - b.order);
  },

  async saveTeamMember(member: TeamMember): Promise<TeamMember> {
    const team = await this.getTeam();
    const index = team.findIndex(t => t.id === member.id);
    if (index >= 0) team[index] = member;
    else team.push(member);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('team').upsert(member);
    }
    setLocalData('zentriya_team', team);
    this.logActivity('Team Member Saved', `Added or updated team sheet for ${member.name}.`);
    return member;
  },

  async deleteTeamMember(id: string): Promise<boolean> {
    const team = await this.getTeam();
    const filtered = team.filter(t => t.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('team').delete().eq('id', id);
    }
    setLocalData('zentriya_team', filtered);
    return true;
  },

  // --------------------------------------------------------------------
  // TESTIMONIALS
  // --------------------------------------------------------------------
  async getTestimonials(): Promise<TestimonialItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('testimonials').select('*');
      if (!error && data) return data as TestimonialItem[];
    }
    return getLocalData<TestimonialItem[]>('zentriya_testimonials', defaultTestimonials);
  },

  async saveTestimonial(testimonial: TestimonialItem): Promise<TestimonialItem> {
    const testimonials = await this.getTestimonials();
    const index = testimonials.findIndex(t => t.id === testimonial.id);
    if (index >= 0) testimonials[index] = testimonial;
    else testimonials.push(testimonial);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('testimonials').upsert(testimonial);
    }
    setLocalData('zentriya_testimonials', testimonials);
    this.logActivity('Testimonial Added', `Saved review from "${testimonial.name}".`);
    return testimonial;
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    const testimonials = await this.getTestimonials();
    const filtered = testimonials.filter(t => t.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('testimonials').delete().eq('id', id);
    }
    setLocalData('zentriya_testimonials', filtered);
    return true;
  },

  // --------------------------------------------------------------------
  // CAREERS & JOB LISTINGS
  // --------------------------------------------------------------------
  async getJobs(): Promise<JobListing[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('jobs').select('*').order('createdAt', { ascending: false });
      if (!error && data) return data as JobListing[];
    }
    return getLocalData<JobListing[]>('zentriya_jobs', defaultJobs);
  },

  async saveJob(job: JobListing): Promise<JobListing> {
    const jobs = await this.getJobs();
    const index = jobs.findIndex(j => j.id === job.id);
    if (index >= 0) jobs[index] = job;
    else jobs.push(job);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('jobs').upsert(job);
    }
    setLocalData('zentriya_jobs', jobs);
    this.logActivity('Career Job Configured', `Saved recruitment post for "${job.title}".`);
    return job;
  },

  async deleteJob(id: string): Promise<boolean> {
    const jobs = await this.getJobs();
    const filtered = jobs.filter(j => j.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('jobs').delete().eq('id', id);
    }
    setLocalData('zentriya_jobs', filtered);
    return true;
  },

  // --------------------------------------------------------------------
  // APPLICATIONS
  // --------------------------------------------------------------------
  async getApplications(): Promise<JobApplication[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('applications').select('*').order('createdAt', { ascending: false });
      if (!error && data) return data as JobApplication[];
    }
    return getLocalData<JobApplication[]>('zentriya_applications', defaultApplications);
  },

  async createApplication(app: JobApplication): Promise<JobApplication> {
    const apps = await this.getApplications();
    apps.push(app);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('applications').insert(app);
    }
    setLocalData('zentriya_applications', apps);

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
    const apps = await this.getApplications();
    const index = apps.findIndex(a => a.id === id);
    if (index >= 0) {
      apps[index].status = status;
      const supabase = getSupabase();
      if (supabase) {
        await supabase.from('applications').update({ status }).eq('id', id);
      }
      setLocalData('zentriya_applications', apps);
      this.logActivity('Application Processed', `Updated applicant status to ${status} for ${apps[index].fullName}.`);
      return true;
    }
    return false;
  },

  async deleteApplication(id: string): Promise<boolean> {
    const apps = await this.getApplications();
    const filtered = apps.filter(a => a.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('applications').delete().eq('id', id);
    }
    setLocalData('zentriya_applications', filtered);
    this.logActivity('Application Deleted', `Removed application reference. ID: ${id}`);
    return true;
  },

  // --------------------------------------------------------------------
  // CONTACT MESSAGES
  // --------------------------------------------------------------------
  async getContactMessages(): Promise<ContactMessage[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('contacts').select('*').order('createdAt', { ascending: false });
      if (!error && data) return data as ContactMessage[];
    }
    return getLocalData<ContactMessage[]>('zentriya_contacts', defaultContacts);
  },

  async createContactMessage(msg: ContactMessage): Promise<ContactMessage> {
    const msgs = await this.getContactMessages();
    msgs.push(msg);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('contacts').insert(msg);
    }
    setLocalData('zentriya_contacts', msgs);

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
    const msgs = await this.getContactMessages();
    const index = msgs.findIndex(m => m.id === id);
    if (index >= 0) {
      msgs[index].isRead = true;
      const supabase = getSupabase();
      if (supabase) {
        await supabase.from('contacts').update({ isRead: true }).eq('id', id);
      }
      setLocalData('zentriya_contacts', msgs);
      return true;
    }
    return false;
  },

  async deleteContactMessage(id: string): Promise<boolean> {
    const msgs = await this.getContactMessages();
    const filtered = msgs.filter(m => m.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('contacts').delete().eq('id', id);
    }
    setLocalData('zentriya_contacts', filtered);
    this.logActivity('Contact Inquiry Deleted', `Removed support ticket ID: ${id}`);
    return true;
  },

  // --------------------------------------------------------------------
  // BLOG POSTS
  // --------------------------------------------------------------------
  async getBlogs(): Promise<BlogPost[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('blogs').select('*').order('createdAt', { ascending: false });
      if (!error && data) return data as BlogPost[];
    }
    return getLocalData<BlogPost[]>('zentriya_blogs', defaultBlogs);
  },

  async saveBlogPost(post: BlogPost): Promise<BlogPost> {
    const blogs = await this.getBlogs();
    const index = blogs.findIndex(b => b.id === post.id);
    if (index >= 0) blogs[index] = post;
    else blogs.push(post);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('blogs').upsert(post);
    }
    setLocalData('zentriya_blogs', blogs);
    this.logActivity('Blog Post Written', `Published blog post: "${post.title}".`);
    return post;
  },

  async deleteBlogPost(id: string): Promise<boolean> {
    const blogs = await this.getBlogs();
    const filtered = blogs.filter(b => b.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('blogs').delete().eq('id', id);
    }
    setLocalData('zentriya_blogs', filtered);
    return true;
  },

  // --------------------------------------------------------------------
  // FAQS
  // --------------------------------------------------------------------
  async getFaqs(): Promise<FaqItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('faqs').select('*');
      if (!error && data) return data as FaqItem[];
    }
    return getLocalData<FaqItem[]>('zentriya_faqs', defaultFaqs);
  },

  async saveFaq(faq: FaqItem): Promise<FaqItem> {
    const faqs = await this.getFaqs();
    const index = faqs.findIndex(f => f.id === faq.id);
    if (index >= 0) faqs[index] = faq;
    else faqs.push(faq);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('faqs').upsert(faq);
    }
    setLocalData('zentriya_faqs', faqs);
    return faq;
  },

  async deleteFaq(id: string): Promise<boolean> {
    const faqs = await this.getFaqs();
    const filtered = faqs.filter(f => f.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('faqs').delete().eq('id', id);
    }
    setLocalData('zentriya_faqs', filtered);
    return true;
  },

  // --------------------------------------------------------------------
  // DOWNLOADS
  // --------------------------------------------------------------------
  async getDownloads(): Promise<DownloadItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('downloads').select('*');
      if (!error && data) return data as DownloadItem[];
    }
    return getLocalData<DownloadItem[]>('zentriya_downloads', defaultDownloads);
  },

  async incrementDownload(id: string): Promise<void> {
    const items = await this.getDownloads();
    const index = items.findIndex(i => i.id === id);
    if (index >= 0) {
      items[index].downloadsCount += 1;
      const supabase = getSupabase();
      if (supabase) {
        await supabase.rpc('increment_download_count', { item_id: id });
      }
      setLocalData('zentriya_downloads', items);
    }
  },

  // --------------------------------------------------------------------
  // PLACEMENT STATS & CLIENT PARTNERS
  // --------------------------------------------------------------------
  async getPlacementStats(): Promise<PlacementStat[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('placement_stats').select('*');
      if (!error && data) return data as PlacementStat[];
    }
    return getLocalData<PlacementStat[]>('zentriya_placement_stats', defaultPlacementStats);
  },

  async savePlacementStat(stat: PlacementStat): Promise<PlacementStat> {
    const stats = await this.getPlacementStats();
    const index = stats.findIndex(s => s.id === stat.id);
    if (index >= 0) stats[index] = stat;
    else stats.push(stat);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('placement_stats').upsert(stat);
    }
    setLocalData('zentriya_placement_stats', stats);
    return stat;
  },

  async deletePlacementStat(id: string): Promise<boolean> {
    const stats = await this.getPlacementStats();
    const filtered = stats.filter(s => s.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('placement_stats').delete().eq('id', id);
    }
    setLocalData('zentriya_placement_stats', filtered);
    return true;
  },

  // Premium Placements (Dynamic Table)
  async getPlacements(): Promise<Placement[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('placements')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data) return data as Placement[];
    }
    const local = getLocalData<Placement[]>('zentriya_placements', defaultPlacements);
    return local.sort((a, b) => a.display_order - b.display_order);
  },

  async savePlacement(placement: Placement): Promise<Placement> {
    const list = await this.getPlacements();
    const index = list.findIndex(p => p.id === placement.id);
    if (index >= 0) list[index] = placement;
    else list.push(placement);
    
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('placements').upsert(placement);
      if (error) console.error('Supabase savePlacement failed:', error);
    }
    setLocalData('zentriya_placements', list);
    return placement;
  },

  async deletePlacement(id: string): Promise<boolean> {
    const list = await this.getPlacements();
    const filtered = list.filter(p => p.id !== id);
    
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('placements').delete().eq('id', id);
    }
    setLocalData('zentriya_placements', filtered);
    return true;
  },

  async reorderPlacements(items: Placement[]): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
      for (const item of items) {
        await supabase.from('placements').upsert(item);
      }
    }
    setLocalData('zentriya_placements', items);
  },

  async getClientPartners(): Promise<ClientPartnerLogo[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('client_partners').select('*');
      if (!error && data) return data as ClientPartnerLogo[];
    }
    return getLocalData<ClientPartnerLogo[]>('zentriya_client_partners', defaultClientPartners);
  },

  async saveClientPartner(cp: ClientPartnerLogo): Promise<ClientPartnerLogo> {
    const items = await this.getClientPartners();
    const index = items.findIndex(i => i.id === cp.id);
    if (index >= 0) items[index] = cp;
    else items.push(cp);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('client_partners').upsert(cp);
    }
    setLocalData('zentriya_client_partners', items);
    return cp;
  },

  async deleteClientPartner(id: string): Promise<boolean> {
    const items = await this.getClientPartners();
    const filtered = items.filter(i => i.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('client_partners').delete().eq('id', id);
    }
    setLocalData('zentriya_client_partners', filtered);
    return true;
  },

  // --------------------------------------------------------------------
  // SYSTEM ACTIVITY LOGS & NOTIFICATIONS (PERSISTENT METRICS)
  // --------------------------------------------------------------------
  async getActivityLogs(): Promise<ActivityLog[]> {
    return getLocalData<ActivityLog[]>('zentriya_activity_logs', defaultActivityLogs);
  },

  logActivity(action: string, details: string) {
    const logs = getLocalData<ActivityLog[]>('zentriya_activity_logs', defaultActivityLogs);
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
    logs.unshift(newLog);
    setLocalData('zentriya_activity_logs', logs.slice(0, 50)); // cap at 50 logs
  },

  async getNotifications(): Promise<SystemNotification[]> {
    return getLocalData<SystemNotification[]>('zentriya_notifications', defaultNotifications);
  },

  createNotification(not: SystemNotification) {
    const nots = getLocalData<SystemNotification[]>('zentriya_notifications', defaultNotifications);
    nots.unshift(not);
    setLocalData('zentriya_notifications', nots.slice(0, 30));
  },

  async markNotificationRead(id: string): Promise<void> {
    const nots = getLocalData<SystemNotification[]>('zentriya_notifications', defaultNotifications);
    const index = nots.findIndex(n => n.id === id);
    if (index >= 0) {
      nots[index].isRead = true;
      setLocalData('zentriya_notifications', nots);
    }
  },

  // --------------------------------------------------------------------
  // WHY CHOOSE US
  // --------------------------------------------------------------------
  async getWhyChooseUs(): Promise<WhyChooseUsItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('why_choose_us').select('*').order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data as WhyChooseUsItem[];
    }
    const local = getLocalData<WhyChooseUsItem[]>('zentriya_why_choose_us', defaultWhyChooseUs);
    return local.sort((a, b) => a.display_order - b.display_order);
  },

  async saveWhyChooseUsItem(item: WhyChooseUsItem): Promise<WhyChooseUsItem> {
    const items = await this.getWhyChooseUs();
    const index = items.findIndex(i => i.id === item.id);
    if (index >= 0) items[index] = item;
    else items.push(item);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('why_choose_us').upsert(item);
    }
    setLocalData('zentriya_why_choose_us', items);
    return item;
  },

  async deleteWhyChooseUsItem(id: string): Promise<boolean> {
    const items = await this.getWhyChooseUs();
    const filtered = items.filter(i => i.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('why_choose_us').delete().eq('id', id);
    }
    setLocalData('zentriya_why_choose_us', filtered);
    return true;
  },

  async saveWhyChooseUsOrder(items: WhyChooseUsItem[]): Promise<void> {
    const updated = items.map((item, idx) => ({
      ...item,
      display_order: idx + 1
    }));
    const supabase = getSupabase();
    if (supabase) {
      for (const item of updated) {
        await supabase.from('why_choose_us').upsert(item);
      }
    }
    setLocalData('zentriya_why_choose_us', updated);
  },

  // --------------------------------------------------------------------
  // STUDENT SUCCESS JOURNEY
  // --------------------------------------------------------------------
  async getStudentJourneySteps(): Promise<StudentJourneyStep[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('student_journey').select('*').order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data as StudentJourneyStep[];
    }
    const local = getLocalData<StudentJourneyStep[]>('zentriya_student_journey', defaultStudentJourneySteps);
    return local.sort((a, b) => a.display_order - b.display_order);
  },

  async saveStudentJourneyStep(step: StudentJourneyStep): Promise<StudentJourneyStep> {
    const items = await this.getStudentJourneySteps();
    const index = items.findIndex(i => i.id === step.id);
    if (index >= 0) items[index] = step;
    else items.push(step);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('student_journey').upsert(step);
    }
    setLocalData('zentriya_student_journey', items);
    return step;
  },

  async deleteStudentJourneyStep(id: string): Promise<boolean> {
    const items = await this.getStudentJourneySteps();
    const filtered = items.filter(i => i.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('student_journey').delete().eq('id', id);
    }
    setLocalData('zentriya_student_journey', filtered);
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
    setLocalData('zentriya_student_journey', updated);
  },

  // --------------------------------------------------------------------
  // INDUSTRY PARTNERS
  // --------------------------------------------------------------------
  async getIndustryPartners(): Promise<IndustryPartner[]> {
    const supabase = getSupabase();
    let partners: IndustryPartner[] = [];
    let isSupabase = false;
    if (supabase) {
      try {
        const { data, error } = await supabase.from('industry_partners').select('*').order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          partners = data as IndustryPartner[];
          isSupabase = true;
        }
      } catch (e) {
        console.error('Supabase query failed:', e);
      }
    }
    
    if (partners.length === 0) {
      partners = getLocalData<IndustryPartner[]>('zentriya_industry_partners', defaultIndustryPartners);
    }

    const logoMap: { [key: string]: string } = {
      'microsoft': 'https://logo.clearbit.com/microsoft.com',
      'google': 'https://logo.clearbit.com/google.com',
      'amazon': 'https://logo.clearbit.com/amazon.com',
      'aws': 'https://logo.clearbit.com/amazon.com',
      'ibm': 'https://logo.clearbit.com/ibm.com',
      'infosys': 'https://logo.clearbit.com/infosys.com',
      'tata': 'https://logo.clearbit.com/tcs.com',
      'tcs': 'https://logo.clearbit.com/tcs.com',
      'accenture': 'https://logo.clearbit.com/accenture.com',
      'cognizant': 'https://logo.clearbit.com/cognizant.com',
      'wipro': 'https://logo.clearbit.com/wipro.com',
      'capgemini': 'https://logo.clearbit.com/capgemini.com',
      'oracle': 'https://logo.clearbit.com/oracle.com',
      'cisco': 'https://logo.clearbit.com/cisco.com',
      'dell': 'https://logo.clearbit.com/dell.com',
      'hcl': 'https://logo.clearbit.com/hcltech.com',
      'hcltech': 'https://logo.clearbit.com/hcltech.com'
    };

    let logoMigrated = false;
    partners = partners.map(partner => {
      const nameLower = partner.company_name.toLowerCase();
      let matchedLogo = '';
      for (const [key, val] of Object.entries(logoMap)) {
        if (nameLower.includes(key)) {
          matchedLogo = val;
          break;
        }
      }
      if (matchedLogo && partner.logo !== matchedLogo) {
        logoMigrated = true;
        return { ...partner, logo: matchedLogo };
      }
      return partner;
    });

    if (logoMigrated) {
      setLocalData('zentriya_industry_partners', partners);
    }

    // Merge missing default partners to make sure TCS, Cognizant, Wipro, and HCLTech are always present and visible
    let updated = logoMigrated;
    const currentList = [...partners];
    for (const def of defaultIndustryPartners) {
      const exists = currentList.some(p => 
        p.id === def.id || 
        p.company_name.toLowerCase().replace(/\s+/g, '') === def.company_name.toLowerCase().replace(/\s+/g, '') ||
        p.company_name.toLowerCase().includes('tcs') && def.company_name.toLowerCase().includes('tcs') ||
        p.company_name.toLowerCase().includes('cognizant') && def.company_name.toLowerCase().includes('cognizant') ||
        p.company_name.toLowerCase().includes('wipro') && def.company_name.toLowerCase().includes('wipro') ||
        p.company_name.toLowerCase().includes('hcl') && def.company_name.toLowerCase().includes('hcl')
      );
      if (!exists) {
        currentList.push(def);
        updated = true;
      }
    }

    if (updated) {
      currentList.sort((a, b) => a.display_order - b.display_order);
      setLocalData('zentriya_industry_partners', currentList);
      if (supabase) {
        // Safely push missing/updated ones to Supabase in the background
        for (const item of currentList) {
          try {
            await supabase.from('industry_partners').upsert(item);
          } catch (e) {
            console.error('Failed to sync partner to Supabase:', e);
          }
        }
      }
      partners = currentList;
    }

    return partners.sort((a, b) => a.display_order - b.display_order);
  },

  async saveIndustryPartner(partner: IndustryPartner): Promise<IndustryPartner> {
    const items = await this.getIndustryPartners();
    const index = items.findIndex(i => i.id === partner.id);
    if (index >= 0) items[index] = partner;
    else items.push(partner);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('industry_partners').upsert(partner);
    }
    setLocalData('zentriya_industry_partners', items);
    return partner;
  },

  async deleteIndustryPartner(id: string): Promise<boolean> {
    const items = await this.getIndustryPartners();
    const filtered = items.filter(i => i.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('industry_partners').delete().eq('id', id);
    }
    setLocalData('zentriya_industry_partners', filtered);
    return true;
  },

  async saveIndustryPartnerOrder(items: IndustryPartner[]): Promise<void> {
    const updated = items.map((item, idx) => ({
      ...item,
      display_order: idx + 1
    }));
    const supabase = getSupabase();
    if (supabase) {
      for (const item of updated) {
        await supabase.from('industry_partners').upsert(item);
      }
    }
    setLocalData('zentriya_industry_partners', updated);
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
      'zentriya_student_journey', 'zentriya_industry_partners', 'zentriya_placements'
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
