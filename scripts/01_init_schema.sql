-- Create users table (handled by Supabase Auth, but we'll add profile data)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  company TEXT,
  country TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create searches table
CREATE TABLE IF NOT EXISTS searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  platforms TEXT[] NOT NULL,
  countries TEXT[] NOT NULL,
  job_titles TEXT[],
  experience_level TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create found_profiles table
CREATE TABLE IF NOT EXISTS found_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_id UUID NOT NULL REFERENCES searches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  platform TEXT NOT NULL,
  profile_url TEXT,
  profile_data JSONB,
  status TEXT DEFAULT 'found', -- found, contacted, interested, rejected
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES found_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, profile_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE found_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view their own searches"
  ON searches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create searches"
  ON searches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own searches"
  ON searches FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their search results"
  ON found_profiles FOR SELECT
  USING (search_id IN (SELECT id FROM searches WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);
