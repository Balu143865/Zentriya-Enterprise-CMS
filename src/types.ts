export type UserRole = 'OWNER';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface WebsiteSettings {
  id: string;
  companyName: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  whatsappNumber: string;
  contactEmail: string;
  contactPhones: string[];
  address: string;
  googleMapEmbedUrl: string;
  popupBannerUrl?: string;
  popupBannerActive: boolean;
  announcementText?: string;
  announcementActive: boolean;
  whyChooseUsTitle?: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    ogImage?: string;
  };
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  order: number;
}

export interface AboutSection {
  id: string;
  title: string;
  description: string;
  image: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  features?: string[];
  benefits?: string[];
  order?: number;
  isActive?: boolean;
  icon: string;
  imageUrl: string;
  galleryUrls: string[];
  seoTitle?: string;
  seoDescription?: string;
  buttonText?: string;
  buttonLink?: string;
  themeColor?: string;
}

export interface InternshipProgram {
  id: string;
  title: string;
  duration: string;
  technology: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  description: string;
  price: number;
  discountPrice?: number;
  features: string[];
  certificateDetails: string;
  bannerUrl: string;
  isActive: boolean;
  order?: number;
}

export interface CourseItem {
  id: string;
  title: string;
  duration: string;
  category: string;
  description: string;
  syllabus: string[];
  price: number;
  discountPrice?: number;
  mode: 'Online' | 'Offline' | 'Self-Paced' | 'Hybrid';
  features: string[];
  isActive: boolean;
  bannerUrl?: string;
  order?: number;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description?: string;
  category: string;
  coverImageUrl: string;
}

export interface GalleryItem {
  id: string;
  albumId?: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  category: string;
}

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  photoUrl: string;
  bio: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  order: number;
}

export interface TestimonialItem {
  id: string;
  name: string;
  rating: number;
  
  // Legacy / Compatibility fields
  companyOrCollege?: string;
  type?: 'Student' | 'Corporate' | 'Video';
  text?: string;
  videoUrl?: string;
  avatarUrl?: string;

  // New fields matching the database schema
  designation?: string;
  company?: string;
  company_logo?: string;
  profile_photo?: string;
  review?: string;
  linkedin?: string;
  is_verified?: boolean;
  display_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salaryRange?: string;
  isActive: boolean;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  experienceYears: number;
  resumeUrl: string; // PDF or Doc URL
  coverLetter?: string;
  status: 'Pending' | 'Reviewed' | 'Shortlisted' | 'Interviewing' | 'Accepted' | 'Rejected';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  imageUrl: string;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  author: string;
  createdAt: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface DownloadItem {
  id: string;
  title: string;
  fileUrl: string;
  category: string; // 'Brochure' | 'Syllabus' | 'Placement Report'
  downloadsCount: number;
}

export interface ClientPartnerLogo {
  id: string;
  name: string;
  logoUrl: string;
  type: 'Client' | 'Partner';
}

export interface PlacementStat {
  id: string;
  studentName: string;
  companyName: string;
  packageLPA: number;
  courseOrInternship: string;
  studentPhoto?: string;
}

export interface Placement {
  id: string;
  student_name: string;
  photo: string;
  company_name: string;
  company_logo: string;
  job_role: string;
  degree: string;
  batch: string;
  package?: number;
  show_package: boolean;
  placement_badge: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  description?: string;
  bottom_badge?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StudentJourneyStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IndustryPartner {
  id: string;
  company_name: string;
  logo: string;
  website_url?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  excerpt?: string; // alias for Home.tsx
  content?: string;
  cover_image: string;
  read_time: string;
  read_time_minutes?: number; // alias for Home.tsx
  category: string;
  author_name: string;
  author_image: string;
  author_avatar?: string; // alias for Home.tsx
  author_designation: string;
  published_date: string;
  published_at?: string; // alias for Home.tsx
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ArticleCategory {
  id: string;
  name: string;
  icon: string;
  display_order: number;
  created_at?: string;
}

export interface ArticleStatistic {
  id: string;
  label: string;
  value: string;
  icon: string;
  display_order: number;
  created_at?: string;
}



