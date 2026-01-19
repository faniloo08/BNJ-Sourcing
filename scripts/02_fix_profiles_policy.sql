-- Allow authenticated users to insert their own profile
-- This is necessary because the backend attempts to create a profile if one doesn't exist
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
