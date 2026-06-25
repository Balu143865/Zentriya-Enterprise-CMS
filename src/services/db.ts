import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  WebsiteSettings, HeroSlide, AboutSection, ServiceItem, 
  InternshipProgram, CourseItem, GalleryAlbum, GalleryItem, 
  TeamMember, TestimonialItem, JobListing, JobApplication, 
  ContactMessage, BlogPost, FaqItem, DownloadItem, 
  ClientPartnerLogo, PlacementStat, ActivityLog, SystemNotification, UserProfile, UserRole 
} from '../types';

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
  whatsappNumber: '+919876543210',
  contactEmail: 'info@zentriya.com',
  contactPhones: ['+91 98765 43210', '+91 80 4321 0987'],
  address: 'Zentriya Towers, 4th Floor, Tech Park Layout, Outer Ring Road, Bangalore, KA, 560103',
  googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9265261353244!2d77.6953282!3d12.9272314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae13bcbebc3e89%3A0xbcf055b3ff75dfc6!2sOuter%20Ring%20Rd%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1689230000000!5m2!1sen!2sin',
  popupBannerUrl: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=800&h=400&fit=crop&q=80',
  popupBannerActive: true,
  announcementText: '🚀 Admissions open for Fall 2026 Enterprise Internship Programs! Apply today to secure a seat.',
  announcementActive: true,
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
  companyOverview: 'Zentriya IT Solutions Private Limited is an elite software consulting and technical enablement enterprise headquartered in Bangalore. Founded by principal IT veterans and corporate instructors, we operate on dual core pillars: engineering top-tier digital products for global businesses, and mentoring the next generation of software professionals through intensive, placement-backed internships and certification bootcamps.',
  vision: 'To be the global benchmark of technical excellence, where business problems find high-integrity digital answers and aspiring engineers evolve into high-performing industry leaders.',
  mission: 'To craft scalable, reliable, and innovative digital solutions for our partners, while simultaneously democratizing enterprise-grade technical training and real-world project experience for students and career-transitioners.',
  coreValues: [
    { title: 'Technical Integrity', description: 'We write clean, efficient, and robust code. We never compromise on technical standards or software design principles.', icon: 'Cpu' },
    { title: 'Mentorship Culture', description: 'Every leader is an instructor. We foster growth, open inquiry, and hands-on code craftsmanship.', icon: 'Users' },
    { title: 'Enterprise Excellence', description: 'From small web portals to high-traffic microservices, our engineering standards mimic global titans like IBM and Microsoft.', icon: 'Award' },
    { title: 'Placement Accountability', description: 'We do not just hand out certificates; we build careers through mock interviews, corporate referrals, and live portfolio work.', icon: 'CheckCircle' }
  ],
  timeline: [
    { year: '2019', title: 'The Genesis', description: 'Zentriya was incorporated as a bespoke IT consulting agency, building high-integrity ERPs and CRM platforms for enterprise partners.' },
    { year: '2021', title: 'Launching Corporate Enablement', description: 'Recognizing a massive industry skill gap, we launched our first batch of corporate-sponsored training bootcamps and intensive hackathons.' },
    { year: '2023', title: 'The Academic Bridge', description: 'Expanded into structured, placement-driven internship models, establishing tie-ups with 35+ premium engineering colleges.' },
    { year: '2026', title: 'Global Certifications & Scale', description: 'Became an authorized training and certification partner for key cloud providers, with over 15,000 trainees mentored and placed globally.' }
  ],
  whyChooseUs: [
    { title: 'Principal Architects as Mentors', description: 'Learn directly from seniors who have engineered systems at scale.' },
    { title: 'Live Corporate Projects', description: 'Gain experience on production-grade systems, complete with code reviews and real team standups.' },
    { title: 'Guaranteed Referral Networks', description: 'Our dedicated HR placement cell is partnered with 120+ software companies across major tech hubs.' },
    { title: 'Enterprise-grade Curriculum', description: 'No outdated textbooks. Learn modern web, cloud, AI, DevOps, and cybersecurity.' }
  ]
};

const defaultServices: ServiceItem[] = [
  {
    id: 'service_1',
    title: 'Custom Software & Mobile Development',
    description: 'Engineering resilient SaaS, custom business portals, CRM tools, and native iOS/Android applications built to withstand enterprise volume.',
    icon: 'Terminal',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&fit=crop&q=80'
    ],
    seoTitle: 'Enterprise Software & Mobile App Development - Zentriya IT',
    seoDescription: 'High-integrity custom software and high-traffic mobile application development by the principal engineers at Zentriya IT Solutions.'
  },
  {
    id: 'service_2',
    title: 'Placement-Backed Internship Programs',
    description: 'Providing intense hands-on internships on real corporate repos, backed by expert code-reviews, resume building, and placement coordination.',
    icon: 'GraduationCap',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=500&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&fit=crop&q=80'
    ],
    seoTitle: 'Premium IT Internships in Bangalore with Placement - Zentriya IT',
    seoDescription: 'Join industry-recognized technical internships. Learn web dev, cloud, and data science while working on actual enterprise client modules.'
  },
  {
    id: 'service_3',
    title: 'Cloud Consulting & DevOps Architecting',
    description: 'Migrating legacy monoliths to resilient cloud platforms. Specializing in AWS/Azure infrastructure, Terraform, Docker, and Kubernetes.',
    icon: 'CloudLightning',
    imageUrl: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800&h=500&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&fit=crop&q=80'
    ],
    seoTitle: 'DevOps & AWS/Azure Cloud Migration Consulting - Zentriya IT',
    seoDescription: 'Streamline software shipping with high-security CI/CD deployment pipelines, serverless consulting, and robust container orchestrations.'
  },
  {
    id: 'service_4',
    title: 'AI, Machine Learning & Analytics',
    description: 'Building custom data pipelines, predictive models, and Gemini-based generative features to unlock maximum value from corporate databases.',
    icon: 'Brain',
    imageUrl: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&h=500&fit=crop&q=80',
    galleryUrls: [],
    seoTitle: 'Generative AI & Data Analytics Services - Zentriya IT',
    seoDescription: 'Unlock predictive business intelligence. Integrate intelligent neural models and data pipelines engineered by Zentriya.'
  },
  {
    id: 'service_5',
    title: 'Elite Bootcamps & Technical Hackathons',
    description: 'Partnering with premium academic institutes to deliver hyper-focused bootcamps, rapid prototyping sprint hackathons, and certifications.',
    icon: 'CodeXml',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop&q=80',
    galleryUrls: [],
    seoTitle: 'College Bootcamps & Corporate Hackathons - Zentriya IT',
    seoDescription: 'Accelerated tech learning bootcamps and rapid coding hackathons tailored for engineering students and working professionals.'
  },
  {
    id: 'service_6',
    title: 'Global Certifications & Corporate Training',
    description: 'Upskilling enterprise workforces in cloud computing, cybersecurity standards, and agile leadership frameworks under accredited guidance.',
    icon: 'ShieldCheck',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop&q=80',
    galleryUrls: [],
    seoTitle: 'Corporate Tech Upskilling & Certifications - Zentriya IT',
    seoDescription: 'Empower your teams with certified masterclasses in AWS, Azure, ISO Security standards, and modern programming stacks.'
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
    title: 'React & TypeScript Enterprise Architecture',
    duration: '8 Weeks',
    category: 'Advanced Frontend',
    description: 'Learn to build clean, maintainable, and type-safe frontends using React 19, TypeScript, state management systems (Zustand/Redux), custom Hooks, performance profiling, and design tokens.',
    syllabus: [
      'Weeks 1-2: Advanced TypeScript Types, Generics, and React integrations',
      'Weeks 3-4: State orchestration, Custom Hook design patterns, and context limits',
      'Weeks 5-6: Performance profiling, virtualization, and lazy loading strategies',
      'Weeks 7-8: Production bundlers, Vite configurations, and CI testing suites'
    ],
    price: 12000,
    discountPrice: 9499,
    mode: 'Online',
    features: ['Accredited Certificate', '12 Hands-on Labs', 'Lifetime Course Repository Access'],
    isActive: true
  },
  {
    id: 'course_2',
    title: 'Java Spring Boot & Microservices Engineering',
    duration: '12 Weeks',
    category: 'Backend Engineering',
    description: 'A robust, corporate-backed masterclass on JVM backend structures. Master Spring Boot, secure OAuth integrations, PostgreSQL schema design, Redis caches, and RabbitMQ message brokers.',
    syllabus: [
      'Weeks 1-3: Spring core, Spring MVC, REST controllers, and JPA repositories',
      'Weeks 4-6: Relational schema engineering, migrations, and indexing strategies',
      'Weeks 7-9: Secure JWT authorization, Spring Security, and role middleware',
      'Weeks 10-12: Eureka discovery, API gateways, load balancing, and Docker deployment'
    ],
    price: 22000,
    discountPrice: 17999,
    mode: 'Self-Paced',
    features: ['1-on-1 Code Reviews', 'Real Enterprise Case Studies', 'Mock HR Interviews'],
    isActive: true
  }
];

const defaultGalleryAlbums: GalleryAlbum[] = [
  { id: 'album_1', title: 'Corporate Headquarters', description: 'Zentriya Towers, state-of-the-art labs and open workspaces.', category: 'Campus', coverImageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&fit=crop&q=80' },
  { id: 'album_2', title: 'National Code Hackathon 2025', description: 'Students and teams sprinting 36-hours to engineer tech solutions.', category: 'Events', coverImageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&fit=crop&q=80' },
  { id: 'album_3', title: 'Student Placement Success Celebrations', description: 'Distributing offer letters to successfully selected interns.', category: 'Placements', coverImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&fit=crop&q=80' }
];

const defaultGalleryItems: GalleryItem[] = [
  { id: 'gal_1', albumId: 'album_1', type: 'image', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&fit=crop&q=80', title: 'Executive Conference Lounge', category: 'Campus' },
  { id: 'gal_2', albumId: 'album_1', type: 'image', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&fit=crop&q=80', title: 'Interactive Developer Lab', category: 'Campus' },
  { id: 'gal_3', albumId: 'album_2', type: 'image', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&fit=crop&q=80', title: 'Team Pitching to Judges', category: 'Events' },
  { id: 'gal_4', albumId: 'album_2', type: 'image', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&fit=crop&q=80', title: 'Award Distribution Ceremony', category: 'Events' },
  { id: 'gal_5', albumId: 'album_3', type: 'image', url: 'https://images.unsplash.com/photo-1521791136364-72861c39045b?w=800&fit=crop&q=80', title: 'Offer Letter Handover - IBM', category: 'Placements' },
  { id: 'gal_6', albumId: 'album_3', type: 'image', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&fit=crop&q=80', title: 'Selected Batch Group Portrait', category: 'Placements' }
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
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'test_2',
    name: 'Vikram Aditya',
    companyOrCollege: 'VP of Tech, InnoCorp Solutions Ltd',
    type: 'Corporate',
    text: 'We recruited 12 engineers from Zentriya IT solutions in our 2025 cycle. Every candidate had robust coding discipline, understood git commands thoroughly, and had worked on real APIs. Outstanding training quality.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&q=80'
  },
  {
    id: 'test_3',
    name: 'Suhail Ahmed',
    companyOrCollege: 'Systems Engineer at Accenture (Alumnus)',
    type: 'Student',
    text: 'Zentriyas Cloud Computing syllabus perfectly mimics what modern corporates use. Setting up AWS instances and configuring Terraform prepared me fully. Highly recommended training!',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80'
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

const defaultActivityLogs: ActivityLog[] = [
  { id: 'act_1', userId: 'usr_admin', userName: 'Admin Chief', userRole: 'Super Admin', action: 'System Initialization', details: 'Configured global system settings and loaded dynamic corporate database schemas.', timestamp: '2026-06-25T00:00:00Z' },
  { id: 'act_2', userId: 'usr_admin', userName: 'Admin Chief', userRole: 'Super Admin', action: 'Syllabus Updated', details: 'Added new syllabus components to the MERN Full Stack internship model.', timestamp: '2026-06-25T02:15:00Z' }
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
      if (!error && data) return data as WebsiteSettings;
    }
    const settings = getLocalData<WebsiteSettings>('zentriya_settings', defaultSettings);
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
      if (!error && data) return data as AboutSection;
    }
    return getLocalData<AboutSection>('zentriya_about', defaultAbout);
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
      const { data, error } = await supabase.from('services').select('*');
      if (!error && data) return data as ServiceItem[];
    }
    return getLocalData<ServiceItem[]>('zentriya_services', defaultServices);
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

  // --------------------------------------------------------------------
  // INTERNSHIP PROGRAMS
  // --------------------------------------------------------------------
  async getInternships(): Promise<InternshipProgram[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('internships').select('*');
      if (!error && data) return data as InternshipProgram[];
    }
    return getLocalData<InternshipProgram[]>('zentriya_internships', defaultInternships);
  },

  async saveInternship(internship: InternshipProgram): Promise<InternshipProgram> {
    const internships = await this.getInternships();
    const index = internships.findIndex(i => i.id === internship.id);
    if (index >= 0) {
      internships[index] = internship;
    } else {
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
    if (supabase) {
      const { data, error } = await supabase.from('courses').select('*');
      if (!error && data) return data as CourseItem[];
    }
    return getLocalData<CourseItem[]>('zentriya_courses', defaultCourses);
  },

  async saveCourse(course: CourseItem): Promise<CourseItem> {
    const courses = await this.getCourses();
    const index = courses.findIndex(c => c.id === course.id);
    if (index >= 0) {
      courses[index] = course;
    } else {
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
    return getLocalData<GalleryAlbum[]>('zentriya_albums', defaultGalleryAlbums);
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
    return getLocalData<GalleryItem[]>('zentriya_gallery', defaultGalleryItems);
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
    let user: UserProfile = { id: 'usr_admin', name: 'Admin Chief', email: 'admin@zentriya.com', role: 'Super Admin' };
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

  getDbConfig() {
    return getDbConfig();
  },

  saveDbConfig(config: DbConfig) {
    saveDbConfig(config);
  }
};
