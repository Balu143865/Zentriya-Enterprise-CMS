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
  companyOrCollege: string;
  type: 'Student' | 'Corporate' | 'Video';
  text: string;
  videoUrl?: string;
  rating: number;
  avatarUrl?: string;
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
  created_at?: string;
  updated_at?: string;
}

