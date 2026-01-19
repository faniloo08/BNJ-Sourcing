-- Script to populate the database with realistic fake data for testing
-- Using the correct table names: profiles, searches, found_profiles

-- Insert test user profiles
INSERT INTO profiles (id, email, full_name, company, country) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'recruiter1@example.com', 'Marie Dupont', 'TechRecruit Africa', 'Senegal'),
('550e8400-e29b-41d4-a716-446655440002', 'recruiter2@example.com', 'Jean Leblanc', 'HR Solutions', 'Ivory Coast'),
('550e8400-e29b-41d4-a716-446655440003', 'recruiter3@example.com', 'Sophie Martin', 'Global Talents', 'Cameroon')
ON CONFLICT (id) DO NOTHING;

-- Insert test searches for recruiter 1
INSERT INTO searches (id, user_id, title, keywords, platforms, countries, job_titles, experience_level, created_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Développeurs Senior', ARRAY['développeur', 'senior'], ARRAY['linkedin', 'facebook'], ARRAY['senegal', 'cote_d_ivoire', 'cameroon'], ARRAY['développeur', 'ingénieur logiciel'], 'senior', NOW() - INTERVAL '7 days'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Data Scientists', ARRAY['data scientist', 'ml engineer'], ARRAY['linkedin', 'indeed'], ARRAY['congo', 'ghana'], ARRAY['data scientist', 'machine learning engineer'], 'mid', NOW() - INTERVAL '3 days'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Product Managers', ARRAY['product manager'], ARRAY['linkedin'], ARRAY['senegal', 'ivory_coast', 'benin'], ARRAY['product manager', 'pm'], 'mid', NOW() - INTERVAL '1 day');

-- Insert found profiles for search 1 - Développeurs Senior
INSERT INTO found_profiles (id, search_id, name, title, platform, profile_url, status, created_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'Moussa Diop', 'Senior Software Engineer', 'LinkedIn', 'https://linkedin.com/in/moussa-diop', 'found', NOW() - INTERVAL '7 days'),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'Fatou Ba', 'Lead Developer', 'LinkedIn', 'https://linkedin.com/in/fatou-ba', 'contacted', NOW() - INTERVAL '7 days'),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', 'Kofi Mensah', 'Full Stack Architect', 'LinkedIn', 'https://linkedin.com/in/kofi-mensah', 'interested', NOW() - INTERVAL '7 days'),
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440001', 'Amara Sow', 'Backend Engineer', 'LinkedIn', 'https://linkedin.com/in/amara-sow', 'found', NOW() - INTERVAL '7 days'),
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440001', 'Nadia Kone', 'DevOps Engineer', 'LinkedIn', 'https://linkedin.com/in/nadia-kone', 'found', NOW() - INTERVAL '7 days'),
('750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440001', 'Alain Traore', 'Software Engineer', 'Facebook', 'https://facebook.com/alain.traore', 'found', NOW() - INTERVAL '7 days'),
('750e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440001', 'Aya Diallo', 'Tech Lead', 'Facebook', 'https://facebook.com/aya.diallo', 'interested', NOW() - INTERVAL '7 days'),
('750e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440001', 'Eric Mensah', 'Principal Engineer', 'Facebook', 'https://facebook.com/eric.mensah', 'found', NOW() - INTERVAL '7 days'),
('750e8400-e29b-41d4-a716-446655440009', '650e8400-e29b-41d4-a716-446655440001', 'Grace Okafor', 'Cloud Architect', 'Facebook', 'https://facebook.com/grace.okafor', 'found', NOW() - INTERVAL '7 days'),
('750e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440001', 'Hakeem Kamara', 'Senior Developer', 'Facebook', 'https://facebook.com/hakeem.kamara', 'found', NOW() - INTERVAL '7 days');

-- Insert found profiles for search 2 - Data Scientists
INSERT INTO found_profiles (id, search_id, name, title, platform, profile_url, status, created_at) VALUES
('750e8400-e29b-41d4-a716-446655440021', '650e8400-e29b-41d4-a716-446655440002', 'Pascal Adeyeye', 'Data Scientist', 'LinkedIn', 'https://linkedin.com/in/pascal-adeyeye', 'found', NOW() - INTERVAL '3 days'),
('750e8400-e29b-41d4-a716-446655440022', '650e8400-e29b-41d4-a716-446655440002', 'Amira Okonkwo', 'ML Engineer', 'LinkedIn', 'https://linkedin.com/in/amira-okonkwo', 'contacted', NOW() - INTERVAL '3 days'),
('750e8400-e29b-41d4-a716-446655440023', '650e8400-e29b-41d4-a716-446655440002', 'Nyoman Adhim', 'Data Analyst', 'Indeed', 'https://indeed.com/viewjob/pascal', 'found', NOW() - INTERVAL '3 days'),
('750e8400-e29b-41d4-a716-446655440024', '650e8400-e29b-41d4-a716-446655440002', 'Erin Mensah', 'Senior Data Scientist', 'LinkedIn', 'https://linkedin.com/in/erin-mensah', 'interested', NOW() - INTERVAL '3 days');

-- Insert found profiles for search 3 - Product Managers
INSERT INTO found_profiles (id, search_id, name, title, platform, profile_url, status, created_at) VALUES
('750e8400-e29b-41d4-a716-446655440025', '650e8400-e29b-41d4-a716-446655440003', 'Michelle Koffi', 'Product Manager', 'LinkedIn', 'https://linkedin.com/in/michelle-koffi', 'found', NOW() - INTERVAL '1 day'),
('750e8400-e29b-41d4-a716-446655440026', '650e8400-e29b-41d4-a716-446655440003', 'Tunde Osuagwu', 'Senior PM', 'LinkedIn', 'https://linkedin.com/in/tunde-osuagwu', 'found', NOW() - INTERVAL '1 day'),
('750e8400-e29b-41d4-a716-446655440027', '650e8400-e29b-41d4-a716-446655440003', 'Ange Kabango', 'Product Director', 'LinkedIn', 'https://linkedin.com/in/ange-kabango', 'interested', NOW() - INTERVAL '1 day'),
('750e8400-e29b-41d4-a716-446655440028', '650e8400-e29b-41d4-a716-446655440003', 'Zoe Mensah', 'Product Lead', 'LinkedIn', 'https://linkedin.com/in/zoe-mensah', 'found', NOW() - INTERVAL '1 day');

-- Create favorites for some profiles
INSERT INTO favorites (user_id, profile_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440007'),
('550e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440025')
ON CONFLICT (user_id, profile_id) DO NOTHING;
