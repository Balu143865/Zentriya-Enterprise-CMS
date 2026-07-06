-- =========================================================
-- PRODUCTION-READY DATABASE INITIALIZATION SCHEMA (SECURED)
-- =========================================================
-- This script provisions a secure, performant database schema 
-- for the Zentriya website using Supabase PostgreSQL.
--
-- Security Model:
-- 1. All tables have Row Level Security (RLS) enabled.
-- 2. Visitors have SELECT-only access to public website content.
-- 3. Visitors can INSERT into `contact_messages` (public contact form submissions).
-- 4. Only authenticated users listed in the `admins` table can INSERT, UPDATE, or DELETE website data.
-- 5. Only admins with the role of 'owner' can manage the `admins` table.
--
-- Instructions:
-- Paste this script into your Supabase Dashboard SQL Editor & Click "Run".

-- ---------------------------------------------------------
-- CLEANUP EXISTING SCHEMA
-- ---------------------------------------------------------
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS contact_information CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS industry_network CASCADE;
DROP TABLE IF EXISTS placements CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS why_choose_us CASCADE;
DROP TABLE IF EXISTS about_section CASCADE;
DROP TABLE IF EXISTS hero_slides CASCADE;
DROP TABLE IF EXISTS website_settings CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Enable standard cryptographic & UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------
-- UTILITY FUNCTIONS
-- ---------------------------------------------------------
-- Reusable function to automatically bump `updated_at` on updates
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------
-- 0. ADMINS DIRECTORY TABLE (AUTH CONTEXT)
-- ---------------------------------------------------------
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE, -- References auth.users(id) via Supabase Auth
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------
-- SECURITY HELPER FUNCTIONS (SECURITY DEFINER to bypass RLS recursion)
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND role = 'owner'
  );
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------
-- 1. WEBSITE SETTINGS TABLE
-- ---------------------------------------------------------
CREATE TABLE website_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL DEFAULT 'Zentriya Technologies',
  logo_url TEXT NOT NULL,
  favicon_url TEXT NOT NULL,
  primary_color TEXT NOT NULL DEFAULT '#0284c7',
  secondary_color TEXT NOT NULL DEFAULT '#0f172a',
  whatsapp_number TEXT,
  contact_email TEXT,
  contact_phones TEXT[] NOT NULL DEFAULT '{}'::text[],
  address TEXT,
  google_map_embed_url TEXT,
  popup_banner_url TEXT,
  popup_banner_active BOOLEAN NOT NULL DEFAULT TRUE,
  announcement_text TEXT,
  announcement_active BOOLEAN NOT NULL DEFAULT TRUE,
  why_choose_us_title TEXT DEFAULT 'Why Choose Zentriya?',
  social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
  seo_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------
-- 2. HERO SLIDES TABLE
-- ---------------------------------------------------------
CREATE TABLE hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  image_url TEXT NOT NULL,
  cta_text TEXT,
  cta_link TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------
-- 3. ABOUT SECTION TABLE
-- ---------------------------------------------------------
CREATE TABLE about_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  features TEXT[] DEFAULT '{}'::text[],
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------
-- 4. WHY CHOOSE US TABLE
-- ---------------------------------------------------------
CREATE TABLE why_choose_us (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------
-- 5. SERVICES TABLE (IT & CONSULTANCY SERVICES)
-- ---------------------------------------------------------
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  detailed_description TEXT,
  icon TEXT NOT NULL,
  image_url TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}'::text[],
  benefits TEXT[] NOT NULL DEFAULT '{}'::text[],
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------
-- 6. PROGRAMS TABLE (COURSES & ACADEMIC OFFERS)
-- ---------------------------------------------------------
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'Online' CHECK (mode IN ('Online', 'Offline', 'Hybrid', 'Self-Paced')),
  syllabus TEXT[] NOT NULL DEFAULT '{}'::text[],
  badges TEXT[] NOT NULL DEFAULT '{}'::text[],
  price NUMERIC NOT NULL DEFAULT 0,
  discount_price NUMERIC,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------
-- 7. PLACEMENTS TABLE (SUCCESS RECORDS & METRICS)
-- ---------------------------------------------------------
CREATE TABLE placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  student_photo TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_logo TEXT NOT NULL,
  job_role TEXT NOT NULL,
  degree TEXT,
  batch TEXT,
  package_lpa NUMERIC,
  show_package BOOLEAN NOT NULL DEFAULT TRUE,
  placement_badge TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------
-- 8. INDUSTRY NETWORK TABLE (PARTNERS & CLIENT LOGOS)
-- ---------------------------------------------------------
CREATE TABLE industry_network (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------
-- 9. TESTIMONIALS TABLE
-- ---------------------------------------------------------
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  company TEXT,
  designation TEXT,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  type TEXT NOT NULL DEFAULT 'Student' CHECK (type IN ('Student', 'Corporate', 'Video')),
  review_text TEXT NOT NULL,
  video_url TEXT,
  linkedin_url TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------
-- 10. TEAM MEMBERS TABLE (ZENTRIYA DIRECTORY)
-- ---------------------------------------------------------
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  bio TEXT,
  social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------
-- 11. GALLERY TABLE (MEDIA ARCHIVE)
-- ---------------------------------------------------------
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'image' CHECK (type IN ('image', 'video')),
  media_url TEXT NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------
-- 12. BLOGS TABLE (EDITORIALS & INSIGHTS)
-- ---------------------------------------------------------
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  cover_image_url TEXT NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  author_name TEXT NOT NULL,
  author_avatar_url TEXT,
  author_designation TEXT,
  read_time_minutes INTEGER NOT NULL DEFAULT 5,
  seo_title TEXT,
  seo_description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------
-- 13. CONTACT INFORMATION TABLE (OFFICES & CONTACT CARDS)
-- ---------------------------------------------------------
CREATE TABLE contact_information (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL DEFAULT 'HQ Office',
  email TEXT,
  phone TEXT,
  address TEXT,
  working_hours TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------
-- 14. CONTACT MESSAGES TABLE (INBOX FOR INQUIRIES)
-- ---------------------------------------------------------
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------
-- DATABASE PERFORMANCE INDEXES
-- ---------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON hero_slides(display_order);
CREATE INDEX IF NOT EXISTS idx_why_choose_us_order ON why_choose_us(display_order);
CREATE INDEX IF NOT EXISTS idx_services_order ON services(display_order);
CREATE INDEX IF NOT EXISTS idx_programs_order ON programs(display_order);
CREATE INDEX IF NOT EXISTS idx_placements_order ON placements(display_order);
CREATE INDEX IF NOT EXISTS idx_industry_network_order ON industry_network(display_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials(display_order);
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery(display_order);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(is_featured);
CREATE INDEX IF NOT EXISTS idx_contact_information_order ON contact_information(display_order);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_admins_user ON public.admins(user_id);

-- ---------------------------------------------------------
-- TRIGGER REGISTRATION (UPDATED_AT AUTO-MANAGEMENT)
-- ---------------------------------------------------------
CREATE TRIGGER update_website_settings_updated_at BEFORE UPDATE ON website_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_hero_slides_updated_at BEFORE UPDATE ON hero_slides FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_about_section_updated_at BEFORE UPDATE ON about_section FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_why_choose_us_updated_at BEFORE UPDATE ON why_choose_us FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_placements_updated_at BEFORE UPDATE ON placements FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_industry_network_updated_at BEFORE UPDATE ON industry_network FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON gallery FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_contact_information_updated_at BEFORE UPDATE ON contact_information FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- =========================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- =========================================================
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE why_choose_us ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_network ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------
-- 1. PUBLIC SELECT PERMISSIONS (Any website visitor can view)
-- ---------------------------------------------------------
CREATE POLICY "Public read website_settings" ON website_settings FOR SELECT USING (true);
CREATE POLICY "Public read hero_slides" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Public read about_section" ON about_section FOR SELECT USING (true);
CREATE POLICY "Public read why_choose_us" ON why_choose_us FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read programs" ON programs FOR SELECT USING (true);
CREATE POLICY "Public read placements" ON placements FOR SELECT USING (true);
CREATE POLICY "Public read industry_network" ON industry_network FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read team_members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Public read contact_information" ON contact_information FOR SELECT USING (true);

-- ---------------------------------------------------------
-- 2. CONTACT FORM INQUIRIES SPECIAL RULE
-- ---------------------------------------------------------
-- Any public visitor can send inquiries (INSERT).
-- Only authorized admins can view, update or delete them.
CREATE POLICY "Public insert contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin select contact_messages" ON contact_messages FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admin update contact_messages" ON contact_messages FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete contact_messages" ON contact_messages FOR DELETE TO authenticated USING (public.is_admin());

-- ---------------------------------------------------------
-- 3. ADMINS TABLE MANAGEMENT POLICY
-- ---------------------------------------------------------
-- Authenticated users can query their own admin state.
-- Only the "owner" role can insert, update or delete other admins.
CREATE POLICY "Select admin profile" ON admins FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Owner manage admins" ON admins FOR ALL TO authenticated USING (public.is_owner()) WITH CHECK (public.is_owner());

-- ---------------------------------------------------------
-- 4. AUTHORIZED WRITE POLICIES FOR ZENTRIYA DATABASE ADMINS
-- ---------------------------------------------------------
-- Website settings management
CREATE POLICY "Admin manage website_settings" ON website_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Hero slides management
CREATE POLICY "Admin manage hero_slides" ON hero_slides FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- About section management
CREATE POLICY "Admin manage about_section" ON about_section FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Why Choose Us management
CREATE POLICY "Admin manage why_choose_us" ON why_choose_us FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Services management
CREATE POLICY "Admin manage services" ON services FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Programs management
CREATE POLICY "Admin manage programs" ON programs FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Placements management
CREATE POLICY "Admin manage placements" ON placements FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Industry Network management
CREATE POLICY "Admin manage industry_network" ON industry_network FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Testimonials management
CREATE POLICY "Admin manage testimonials" ON testimonials FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Team members directory management
CREATE POLICY "Admin manage team_members" ON team_members FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Gallery management
CREATE POLICY "Admin manage gallery" ON gallery FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Blogs management
CREATE POLICY "Admin manage blogs" ON blogs FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Contact information cards management
CREATE POLICY "Admin manage contact_information" ON contact_information FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- =========================================================
-- BUCKETS & STORAGE SECURITIES CONFIGURATION
-- =========================================================
-- 1. Create storage buckets programmatically
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('hero', 'hero', true),
  ('logos', 'logos', true),
  ('gallery', 'gallery', true),
  ('programs', 'programs', true),
  ('services', 'services', true),
  ('team', 'team', true),
  ('blogs', 'blogs', true),
  ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage access policies
DROP POLICY IF EXISTS "Public Read Access for Buckets" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Access" ON storage.objects;

CREATE POLICY "Public Read Access for Buckets" ON storage.objects
FOR SELECT USING (
  bucket_id IN ('hero', 'logos', 'gallery', 'programs', 'services', 'team', 'blogs', 'documents')
);

CREATE POLICY "Admin Upload Access" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id IN ('hero', 'logos', 'gallery', 'programs', 'services', 'team', 'blogs', 'documents')
  AND public.is_admin()
);

CREATE POLICY "Admin Update Access" ON storage.objects
FOR UPDATE USING (
  bucket_id IN ('hero', 'logos', 'gallery', 'programs', 'services', 'team', 'blogs', 'documents')
  AND public.is_admin()
) WITH CHECK (
  bucket_id IN ('hero', 'logos', 'gallery', 'programs', 'services', 'team', 'blogs', 'documents')
  AND public.is_admin()
);

CREATE POLICY "Admin Delete Access" ON storage.objects
FOR DELETE USING (
  bucket_id IN ('hero', 'logos', 'gallery', 'programs', 'services', 'team', 'blogs', 'documents')
  AND public.is_admin()
);
-- =========================================================
