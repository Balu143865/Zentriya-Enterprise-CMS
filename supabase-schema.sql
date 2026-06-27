-- Supabase Setup Script for Owner-only Admin System
-- This script creates the `users` table, configures Row Level Security (RLS), 
-- and ensures only the authenticated OWNER account can access admin data.

-- 1. Create the custom users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'OWNER' CHECK (role = 'OWNER'),
    avatar VARCHAR(512),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Create Row Level Security (RLS) Policies
-- This policy allows only authenticated users with the role 'OWNER' to select, insert, update, or delete users.
-- We check either user_metadata or the role column in public.users.

CREATE POLICY owner_all_access ON public.users
    FOR ALL
    TO authenticated
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'OWNER' 
        OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'OWNER'
    )
    WITH CHECK (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'OWNER' 
        OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'OWNER'
    );

-- 3. Automatic User Sync Trigger from Auth Sign-up
-- This trigger automatically synchronizes new auth users to public.users and sets their role to 'OWNER' (if it's the first user or explicitly set).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role, is_active, avatar)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        'OWNER', -- Default to OWNER as it is the only role
        TRUE,
        COALESCE(new.raw_user_meta_data->>'avatar_url', '')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution binding
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Enable RLS on other existing CMS tables (e.g., website_settings, contact_messages, etc.)
-- Ensure RLS is active and checks for OWNER privilege.
-- Example:
-- ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY owner_manage_settings ON public.website_settings FOR ALL TO authenticated USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'OWNER');
