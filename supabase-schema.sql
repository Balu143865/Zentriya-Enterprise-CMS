-- ==========================================
-- ZENTRIYA DATABASE INITIALIZATION SCHEMA
-- ==========================================
-- This script creates all 28 tables required for the Zentriya Admin & Website,
-- along with appropriate foreign keys, check constraints, default values, and indexes.
--
-- Instructions:
-- 1. Log in to your Supabase Dashboard.
-- 2. Open the SQL Editor from the left-hand menu.
-- 3. Click "New query" and paste this script in.
-- 4. Click "Run" to initialize all tables.

-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS article_statistics CASCADE;
DROP TABLE IF EXISTS article_categories CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS industry_partners CASCADE;
DROP TABLE IF EXISTS student_journey CASCADE;
DROP TABLE IF EXISTS why_choose_us CASCADE;
DROP TABLE IF EXISTS client_partners CASCADE;
DROP TABLE IF EXISTS placements CASCADE;
DROP TABLE IF EXISTS placement_stats CASCADE;
DROP TABLE IF EXISTS downloads CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS team CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS albums CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS internships CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS about CASCADE;
DROP TABLE IF EXISTS hero CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Website Settings
CREATE TABLE settings (
  id TEXT PRIMARY KEY,
  "companyName" TEXT NOT NULL,
  "logoUrl" TEXT NOT NULL,
  "faviconUrl" TEXT NOT NULL,
  "primaryColor" TEXT NOT NULL,
  "secondaryColor" TEXT NOT NULL,
  "whatsappNumber" TEXT NOT NULL,
  "contactEmail" TEXT NOT NULL,
  "contactPhones" TEXT[] NOT NULL,
  address TEXT DEFAULT '',
  "googleMapEmbedUrl" TEXT DEFAULT '',
  "popupBannerUrl" TEXT,
  "popupBannerActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "announcementText" TEXT,
  "announcementActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "whyChooseUsTitle" TEXT DEFAULT 'Why Choose Us?',
  "socialLinks" JSONB NOT NULL DEFAULT '{}'::jsonb,
  seo JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- 2. Hero Slider
CREATE TABLE hero (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "ctaText" TEXT NOT NULL,
  "ctaLink" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0
);

-- 3. About Section
CREATE TABLE about (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. IT Services
CREATE TABLE services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "detailedDescription" TEXT,
  features TEXT[] DEFAULT '{}'::text[],
  benefits TEXT[] DEFAULT '{}'::text[],
  "order" INTEGER DEFAULT 0,
  "isActive" BOOLEAN DEFAULT TRUE,
  icon TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "galleryUrls" TEXT[] NOT NULL DEFAULT '{}'::text[],
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "buttonText" TEXT,
  "buttonLink" TEXT,
  "themeColor" TEXT
);

-- 5. Internship Programs
CREATE TABLE internships (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  duration TEXT NOT NULL,
  technology TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('Online', 'Offline', 'Hybrid')),
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  "discountPrice" NUMERIC,
  features TEXT[] NOT NULL DEFAULT '{}'::text[],
  "certificateDetails" TEXT NOT NULL,
  "bannerUrl" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "order" INTEGER DEFAULT 0
);

-- 6. Academic / Certification Courses
CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  duration TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  syllabus TEXT[] NOT NULL DEFAULT '{}'::text[],
  price NUMERIC NOT NULL,
  "discountPrice" NUMERIC,
  mode TEXT NOT NULL CHECK (mode IN ('Online', 'Offline', 'Self-Paced', 'Hybrid')),
  features TEXT[] NOT NULL DEFAULT '{}'::text[],
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "bannerUrl" TEXT,
  "order" INTEGER DEFAULT 0
);

-- 7. High-Performance Programs
CREATE TABLE programs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  mode TEXT NOT NULL,
  syllabus TEXT[] NOT NULL DEFAULT '{}'::text[],
  badges TEXT[] NOT NULL DEFAULT '{}'::text[],
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Gallery Albums
CREATE TABLE albums (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  "coverImageUrl" TEXT NOT NULL
);

-- 9. Gallery Items (Images & Videos)
CREATE TABLE gallery (
  id TEXT PRIMARY KEY,
  "albumId" TEXT REFERENCES albums(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL
);

-- 10. Team Members Directory
CREATE TABLE team (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  "photoUrl" TEXT NOT NULL,
  bio TEXT NOT NULL,
  "socialLinks" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "order" INTEGER NOT NULL DEFAULT 0
);

-- 11. Customer & Alumni Testimonials
CREATE TABLE testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  "companyOrCollege" TEXT,
  type TEXT CHECK (type IN ('Student', 'Corporate', 'Video')),
  text TEXT,
  "videoUrl" TEXT,
  "avatarUrl" TEXT,
  designation TEXT,
  company TEXT,
  company_logo TEXT,
  profile_photo TEXT,
  review TEXT,
  linkedin TEXT,
  is_verified BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Corporate Careers Listings
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Full-time', 'Part-time', 'Contract', 'Internship')),
  experience TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL DEFAULT '{}'::text[],
  responsibilities TEXT[] NOT NULL DEFAULT '{}'::text[],
  "salaryRange" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Recruitment Applications Tracker
CREATE TABLE applications (
  id TEXT PRIMARY KEY,
  "jobId" TEXT REFERENCES jobs(id) ON DELETE CASCADE,
  "jobTitle" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  "experienceYears" NUMERIC NOT NULL,
  "resumeUrl" TEXT NOT NULL,
  "coverLetter" TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Reviewed', 'Shortlisted', 'Interviewing', 'Accepted', 'Rejected')),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Contact Messages & Consultations Inquiries
CREATE TABLE contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Editorial Blogs Directory
CREATE TABLE blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  "imageUrl" TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  author TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. FAQs Directory
CREATE TABLE faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL
);

-- 17. Syllabus & Report Downloads Library
CREATE TABLE downloads (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  category TEXT NOT NULL,
  "downloadsCount" INTEGER NOT NULL DEFAULT 0
);

-- 18. Micro Placement Statistics (Aggregates)
CREATE TABLE placement_stats (
  id TEXT PRIMARY KEY,
  "studentName" TEXT NOT NULL,
  "companyName" TEXT NOT NULL,
  "packageLPA" NUMERIC NOT NULL,
  "courseOrInternship" TEXT NOT NULL,
  "studentPhoto" TEXT
);

-- 19. Structured Placement Records
CREATE TABLE placements (
  id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  photo TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_logo TEXT NOT NULL,
  job_role TEXT NOT NULL,
  degree TEXT NOT NULL,
  batch TEXT NOT NULL,
  package NUMERIC,
  show_package BOOLEAN NOT NULL DEFAULT TRUE,
  placement_badge TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. Client & Partner Corporate Logos
CREATE TABLE client_partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "logoUrl" TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Client', 'Partner'))
);

-- 21. Corporate Activity Audit Logs
CREATE TABLE activity_logs (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "userName" TEXT NOT NULL,
  "userRole" TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. System Alerts & Security Notifications
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 23. "Why Choose Us" Selling Points
CREATE TABLE why_choose_us (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  icon TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  description TEXT,
  bottom_badge TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 24. Student Journey Pipeline
CREATE TABLE student_journey (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 25. Industry Placement Alliances
CREATE TABLE industry_partners (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  logo TEXT NOT NULL,
  website_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 26. Editorial Articles
CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT NOT NULL,
  read_time TEXT NOT NULL,
  read_time_minutes INTEGER,
  category TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_image TEXT NOT NULL,
  author_avatar TEXT,
  author_designation TEXT NOT NULL,
  published_date TEXT NOT NULL,
  published_at TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 27. Article Categories
CREATE TABLE article_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 28. Article Statistics Counter Metrics
CREATE TABLE article_statistics (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add database performance indexes for common search fields
CREATE INDEX IF NOT EXISTS idx_gallery_album ON gallery("albumId");
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_placements_display ON placements(display_order);
CREATE INDEX IF NOT EXISTS idx_articles_display ON articles(display_order);

-- Enable Row-Level Security (RLS) but default to open access rules for fully public reading
-- and authenticated/open editing for Zentriya Console (as authentication is not implemented yet)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE why_choose_us ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_journey ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_statistics ENABLE ROW LEVEL SECURITY;

-- Allow all reads publicly
CREATE POLICY "Public Read Settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Public Read Hero" ON hero FOR SELECT USING (true);
CREATE POLICY "Public Read About" ON about FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON services FOR SELECT USING (true);
CREATE POLICY "Public Read Internships" ON internships FOR SELECT USING (true);
CREATE POLICY "Public Read Courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Public Read Programs" ON programs FOR SELECT USING (true);
CREATE POLICY "Public Read Albums" ON albums FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public Read Team" ON team FOR SELECT USING (true);
CREATE POLICY "Public Read Testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public Read Jobs" ON jobs FOR SELECT USING (true);
CREATE POLICY "Public Read Applications" ON applications FOR SELECT USING (true);
CREATE POLICY "Public Read Contacts" ON contacts FOR SELECT USING (true);
CREATE POLICY "Public Read Blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Public Read FAQs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Public Read Downloads" ON downloads FOR SELECT USING (true);
CREATE POLICY "Public Read Placement Stats" ON placement_stats FOR SELECT USING (true);
CREATE POLICY "Public Read Placements" ON placements FOR SELECT USING (true);
CREATE POLICY "Public Read Client Partners" ON client_partners FOR SELECT USING (true);
CREATE POLICY "Public Read Activity Logs" ON activity_logs FOR SELECT USING (true);
CREATE POLICY "Public Read Notifications" ON notifications FOR SELECT USING (true);
CREATE POLICY "Public Read Why Choose Us" ON why_choose_us FOR SELECT USING (true);
CREATE POLICY "Public Read Student Journey" ON student_journey FOR SELECT USING (true);
CREATE POLICY "Public Read Industry Partners" ON industry_partners FOR SELECT USING (true);
CREATE POLICY "Public Read Articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Public Read Article Categories" ON article_categories FOR SELECT USING (true);
CREATE POLICY "Public Read Article Statistics" ON article_statistics FOR SELECT USING (true);

-- Allow all modifications (insert/update/delete) publicly for the admin panel (temporary while auth is bypassed)
CREATE POLICY "Permissive Write Settings" ON settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Hero" ON hero FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write About" ON about FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Services" ON services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Internships" ON internships FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Courses" ON courses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Programs" ON programs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Albums" ON albums FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Gallery" ON gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Team" ON team FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Jobs" ON jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Applications" ON applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Contacts" ON contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Blogs" ON blogs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write FAQs" ON faqs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Downloads" ON downloads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Placement Stats" ON placement_stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Placements" ON placements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Client Partners" ON client_partners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Activity Logs" ON activity_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Why Choose Us" ON why_choose_us FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Student Journey" ON student_journey FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Industry Partners" ON industry_partners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Articles" ON articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Article Categories" ON article_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Write Article Statistics" ON article_statistics FOR ALL USING (true) WITH CHECK (true);


-- =====================================================================
-- BUCKETS CONFIGURATION INSTRUCTIONS
-- =====================================================================
-- Please create the following public storage buckets in Supabase Storage:
-- 1. "gallery"     - For all uploaded banner images, logos, photos.
-- 2. "resumes"     - For job application resumes (.pdf, .docx).
-- 3. "downloads"   - For files, brochures, or reports.
--
-- Ensure "Public bucket" toggled ON when creating these buckets in Supabase UI.
-- =====================================================================
