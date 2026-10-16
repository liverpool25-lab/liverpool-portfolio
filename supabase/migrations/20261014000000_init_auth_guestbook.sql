-- ==============================================================================
-- LIVERPOOL PORTFOLIO — SUPABASE POSTGRESQL MIGRATION
-- Migration: 20261014000000_init_auth_guestbook.sql
-- Features: User profiles, Guestbook table, Row Level Security (RLS), Triggers
-- ==============================================================================

-- 1. Create Profiles Table (Synchronized with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Community Guest',
  avatar_url TEXT,
  email TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- 2. Create Guestbook Table
CREATE TABLE IF NOT EXISTS public.guestbook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT,
  author_avatar TEXT,
  message TEXT NOT NULL CHECK (char_length(trim(message)) > 0 AND char_length(message) <= 500),
  is_approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON public.guestbook(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guestbook_user_id ON public.guestbook(user_id);

-- Enable RLS on guestbook
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;

-- Guestbook Policies
-- 1. Public can read approved entries
CREATE POLICY "Approved guestbook entries are publicly readable" 
  ON public.guestbook 
  FOR SELECT 
  USING (is_approved = true);

-- 2. Only authenticated users can insert their own messages
CREATE POLICY "Authenticated users can create guestbook entries" 
  ON public.guestbook 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id 
    AND char_length(trim(message)) > 0 
    AND char_length(message) <= 500
  );

-- 3. Users can only update or delete their own entries
CREATE POLICY "Users can update their own guestbook entries" 
  ON public.guestbook 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own guestbook entries" 
  ON public.guestbook 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. Automatic Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1), 'Guest'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
