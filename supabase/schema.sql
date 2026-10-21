-- ============================================================
-- PORTFOLIO DATABASE SCHEMA & POLICIES FOR SUPABASE
-- Run this complete script in the Supabase SQL Editor.
-- ============================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. ADMIN AUTHORIZATION SETUP
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper function to verify if the currently authenticated user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
  );
$$;

-- Policies for admin_users table (admins can read/write)
CREATE POLICY "Admins can view admin_users"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Users can view their own admin record"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Superadmins can manage admin_users"
  ON public.admin_users FOR ALL
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Allow bootstrap initial admin"
  ON public.admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (SELECT 1 FROM public.admin_users)
  );

-- ============================================================
-- 2. PORTFOLIO TABLES
-- ============================================================

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  headline TEXT,
  introduction TEXT,
  profile_image_url TEXT,
  academic_status TEXT,
  about_text TEXT,
  interests TEXT,
  career_goals TEXT,
  expertise_areas TEXT,
  bio TEXT,
  email TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  resume_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EDUCATION TABLE
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  department TEXT,
  start_year INTEGER NOT NULL,
  end_year INTEGER,
  is_current BOOLEAN DEFAULT FALSE,
  cgpa TEXT,
  description TEXT,
  achievements TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INTEGER CHECK (proficiency >= 1 AND proficiency <= 5),
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  detailed_description TEXT,
  technologies TEXT[] DEFAULT '{}',
  image_url TEXT,
  github_url TEXT,
  live_url TEXT,
  category TEXT DEFAULT 'General',
  start_date DATE,
  completion_date DATE,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RESEARCH TABLE
CREATE TABLE IF NOT EXISTS public.research (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  research_area TEXT,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'published', 'completed')),
  authors TEXT,
  date TEXT,
  paper_url TEXT,
  relevant_links TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EXPERIENCE TABLE
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position TEXT NOT NULL,
  organization TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Internship',
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT NOT NULL,
  responsibilities TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  date TEXT,
  description TEXT,
  credential_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_title TEXT NOT NULL DEFAULT 'Portfolio',
  site_description TEXT,
  footer_text TEXT,
  og_image_url TEXT,
  favicon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_education_published_order ON public.education(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_skills_published_cat_order ON public.skills(is_published, category, display_order);
CREATE INDEX IF NOT EXISTS idx_projects_published_featured ON public.projects(is_published, is_featured, display_order);
CREATE INDEX IF NOT EXISTS idx_research_published_order ON public.research(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_experience_published_order ON public.experience(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_achievements_published_order ON public.achievements(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_social_published_order ON public.social_links(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.contact_messages(created_at DESC);

-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- PROFILES POLICIES
-- Public can read profile
CREATE POLICY "Public can view profile"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin can manage profile
CREATE POLICY "Admins can manage profile"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_admin());

-- ------------------------------------------------------------
-- EDUCATION POLICIES
-- Public can only view published education
CREATE POLICY "Public can view published education"
  ON public.education FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Admin can manage all education
CREATE POLICY "Admins can manage education"
  ON public.education FOR ALL
  TO authenticated
  USING (public.is_admin());

-- ------------------------------------------------------------
-- SKILLS POLICIES
-- Public can only view published skills
CREATE POLICY "Public can view published skills"
  ON public.skills FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Admin can manage all skills
CREATE POLICY "Admins can manage skills"
  ON public.skills FOR ALL
  TO authenticated
  USING (public.is_admin());

-- ------------------------------------------------------------
-- PROJECTS POLICIES
-- Public can only view published projects
CREATE POLICY "Public can view published projects"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Admin can manage all projects
CREATE POLICY "Admins can manage projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (public.is_admin());

-- ------------------------------------------------------------
-- RESEARCH POLICIES
-- Public can only view published research
CREATE POLICY "Public can view published research"
  ON public.research FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Admin can manage all research
CREATE POLICY "Admins can manage research"
  ON public.research FOR ALL
  TO authenticated
  USING (public.is_admin());

-- ------------------------------------------------------------
-- EXPERIENCE POLICIES
-- Public can only view published experience
CREATE POLICY "Public can view published experience"
  ON public.experience FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Admin can manage all experience
CREATE POLICY "Admins can manage experience"
  ON public.experience FOR ALL
  TO authenticated
  USING (public.is_admin());

-- ------------------------------------------------------------
-- ACHIEVEMENTS POLICIES
-- Public can only view published achievements
CREATE POLICY "Public can view published achievements"
  ON public.achievements FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Admin can manage all achievements
CREATE POLICY "Admins can manage achievements"
  ON public.achievements FOR ALL
  TO authenticated
  USING (public.is_admin());

-- ------------------------------------------------------------
-- SOCIAL LINKS POLICIES
-- Public can only view published links
CREATE POLICY "Public can view published social links"
  ON public.social_links FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Admin can manage all social links
CREATE POLICY "Admins can manage social links"
  ON public.social_links FOR ALL
  TO authenticated
  USING (public.is_admin());

-- ------------------------------------------------------------
-- SITE SETTINGS POLICIES
-- Public can view site settings
CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin can manage site settings
CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_admin());

-- ------------------------------------------------------------
-- CONTACT MESSAGES POLICIES
-- Public can insert new contact messages
CREATE POLICY "Public can insert contact messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only Admins can view and delete contact messages
CREATE POLICY "Admins can view and manage contact messages"
  ON public.contact_messages FOR ALL
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- 5. STORAGE BUCKET & POLICIES (FOR PORTFOLIO IMAGES)
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view images in the portfolio bucket
CREATE POLICY "Public can view portfolio bucket objects"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'portfolio');

-- Admin can upload and delete portfolio images
CREATE POLICY "Admins can upload to portfolio bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio' AND public.is_admin());

CREATE POLICY "Admins can update portfolio bucket"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio' AND public.is_admin());

CREATE POLICY "Admins can delete from portfolio bucket"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio' AND public.is_admin());

-- ============================================================
-- 6. INITIAL SEED DATA (STUDENT PLACEHOLDERS)
-- ============================================================

-- Profile Seed
INSERT INTO public.profiles (
  full_name,
  headline,
  introduction,
  academic_status,
  about_text,
  interests,
  career_goals,
  expertise_areas,
  bio,
  email,
  github_url,
  linkedin_url
) VALUES (
  '[Student Name]',
  '[Computer Science & Engineering Student | Aspiring Software Engineer]',
  'Passionate university student specializing in full-stack development, modern web systems, and applied machine learning. Dedicated to writing clean, maintainable code and contributing to open-source and research projects.',
  '[Undergraduate Student at University Name]',
  'I am a motivated computer science undergraduate focused on building scalable, accessible, and user-centric software solutions. My academic background has provided me with a strong foundation in algorithms, systems design, and database engineering.',
  'Distributed Systems, Cloud Architecture, Artificial Intelligence, Web Performance, Open Source Software',
  'Seeking software engineering internships and collaborative research opportunities where I can apply my skills to solve real-world problems and grow as an engineer.',
  'Full-Stack Web Development, REST APIs, Database Design, Data Structures & Algorithms',
  'When not coding or studying, I enjoy participating in technical hackathons, exploring new developer tools, reading research publications, and mentoring peers.',
  'student@example.edu',
  'https://github.com',
  'https://linkedin.com'
) ON CONFLICT DO NOTHING;

-- Education Seed
INSERT INTO public.education (institution, degree, department, start_year, end_year, is_current, cgpa, description, achievements, display_order, is_published)
VALUES
  ('[University Name]', 'Bachelor of Science in Computer Science & Engineering', 'Department of Computer Science', 2022, 2026, TRUE, '[3.85 / 4.00]', 'Relevant coursework includes Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Computer Networks, Operating Systems, and Software Engineering.', 'Dean''s Honor List (Multiple Semesters), Academic Merit Scholarship Recipient', 1, TRUE),
  ('[College / High School Name]', 'Higher Secondary Certificate (Science)', 'Science & Mathematics', 2020, 2022, FALSE, '[GPA 5.00 / 5.00]', 'Focused on Advanced Mathematics, Physics, Chemistry, and Information & Communication Technology.', 'Graduated with Highest Distinction in Mathematics', 2, TRUE)
ON CONFLICT DO NOTHING;

-- Skills Seed
INSERT INTO public.skills (name, category, proficiency, display_order, is_published)
VALUES
  ('TypeScript', 'Programming & Development', 5, 1, TRUE),
  ('JavaScript (ES6+)', 'Programming & Development', 5, 2, TRUE),
  ('Python', 'Programming & Development', 4, 3, TRUE),
  ('C / C++', 'Programming & Development', 4, 4, TRUE),
  ('SQL / PostgreSQL', 'Programming & Development', 4, 5, TRUE),
  ('HTML5 & CSS3', 'Programming & Development', 5, 6, TRUE),
  ('PyTorch', 'AI & Machine Learning', 3, 1, TRUE),
  ('Scikit-Learn', 'AI & Machine Learning', 4, 2, TRUE),
  ('NumPy & Pandas', 'AI & Machine Learning', 4, 3, TRUE),
  ('Experimental Design', 'Research & Data Analysis', 4, 1, TRUE),
  ('Scientific Writing (LaTeX)', 'Research & Data Analysis', 4, 2, TRUE),
  ('Next.js & React', 'Tools & Technologies', 5, 1, TRUE),
  ('Git & GitHub', 'Tools & Technologies', 5, 2, TRUE),
  ('Tailwind CSS', 'Tools & Technologies', 5, 3, TRUE),
  ('Supabase', 'Tools & Technologies', 4, 4, TRUE),
  ('Docker & Linux', 'Tools & Technologies', 3, 5, TRUE),
  ('Technical Presentation', 'Communication & Other', 4, 1, TRUE),
  ('Peer Mentoring', 'Communication & Other', 5, 2, TRUE)
ON CONFLICT DO NOTHING;

-- Projects Seed
INSERT INTO public.projects (title, short_description, detailed_description, technologies, category, is_featured, display_order, is_published, github_url, live_url)
VALUES
  ('[Project 1: Research Paper Summarizer & Semantic Search]', 'An AI-powered academic tool providing automated abstract summarization and cross-document semantic search using vector embeddings.', 'Developed an end-to-end web platform for university students and researchers to upload PDF papers, generate concise bulleted summaries, and query paper archives via semantic embeddings.', ARRAY['Next.js', 'TypeScript', 'Python', 'Tailwind CSS', 'Vector DB'], 'AI & Web Application', TRUE, 1, TRUE, 'https://github.com', 'https://demo.example.com'),
  ('[Project 2: Campus Event & Course Collaboration Portal]', 'A real-time student platform for university club activities, study groups, and peer review of academic courses.', 'Architected with a relational database model, row-level security, and role-based access control. Implemented event scheduling, RSVP management, and student feedback boards.', ARRAY['React', 'Supabase', 'PostgreSQL', 'Tailwind CSS'], 'Full-Stack Web App', TRUE, 2, TRUE, 'https://github.com', 'https://demo.example.com'),
  ('[Project 3: High-Performance Distributed Task Queue]', 'A lightweight distributed background worker engine with exponential backoff retry logic and telemetry dashboard.', 'Implemented in Node.js and Redis. Supports priority scheduling, worker health heartbeats, dead-letter queues, and real-time job throughput monitoring.', ARRAY['Node.js', 'Redis', 'TypeScript', 'Docker'], 'Systems & Backend', FALSE, 3, TRUE, 'https://github.com', NULL)
ON CONFLICT DO NOTHING;

-- Research Seed
INSERT INTO public.research (title, description, research_area, status, authors, date, paper_url, display_order, is_published)
VALUES
  ('[Research: Efficient Embedding Quantization for Edge RAG Pipelines]', 'Investigating techniques to compress high-dimensional vector embeddings for low-latency neural information retrieval on resource-constrained devices.', 'Natural Language Processing & Systems', 'in_progress', '[Your Name], [Advisor Name]', '2024 - Present', NULL, 1, TRUE),
  ('[Study on Student Learning Outcomes in Hybrid Computer Science Curricula]', 'An empirical investigation analyzing student performance and engagement metrics between remote and in-person laboratory programming coursework.', 'Computer Science Education', 'completed', '[Your Name], [Co-Author Name]', '2023', 'https://example.com/paper.pdf', 2, TRUE)
ON CONFLICT DO NOTHING;

-- Experience Seed
INSERT INTO public.experience (position, organization, type, start_date, end_date, is_current, description, responsibilities, display_order, is_published)
VALUES
  ('Undergraduate Teaching Assistant', '[University Department of Computer Science]', 'University Activity', '2023-08-01', NULL, TRUE, 'Assisting course instructors with teaching laboratory sessions and mentoring students in introductory data structures.', '• Conduct weekly lab sessions and office hours for 60+ undergraduate students.\n• Grade programming assignments and guide students in debugging C++ and Python code.\n• Assist in drafting examination problems and automated test suites.', 1, TRUE),
  ('Software Engineering Intern', '[Tech Company or Research Lab Name]', 'Internship', '2024-06-01', '2024-08-31', FALSE, 'Developed internal web tools, optimized database query bottlenecks, and contributed to frontend feature rollouts.', '• Built reusable React components and integrated RESTful endpoints with TypeScript.\n• Reduced average database query latency by 35% through indexing and query refactoring.\n• Collaborated in weekly Agile sprints, code reviews, and cross-functional design discussions.', 2, TRUE)
ON CONFLICT DO NOTHING;

-- Achievements Seed
INSERT INTO public.achievements (title, organization, date, description, display_order, is_published)
VALUES
  ('Dean''s Honor List', '[University Name]', '2023 - 2024', 'Awarded for maintaining a semester GPA within the top 5% of the engineering faculty.', 1, TRUE),
  ('Champion / First Place - Annual University Hackathon', '[University Computer Club]', 'Spring 2024', 'Designed and built an accessibility-focused study tool in a 36-hour sprint with a team of four.', 2, TRUE)
ON CONFLICT DO NOTHING;

-- Social Links Seed
INSERT INTO public.social_links (platform, url, icon_name, display_order, is_published)
VALUES
  ('GitHub', 'https://github.com', 'github', 1, TRUE),
  ('LinkedIn', 'https://linkedin.com', 'linkedin', 2, TRUE)
ON CONFLICT DO NOTHING;

-- Site Settings Seed
INSERT INTO public.site_settings (site_title, site_description, footer_text)
VALUES (
  '[Student Name] | Personal Portfolio',
  'Academic background, skills, projects, research, and experience of [Student Name].',
  'Student Portfolio. All rights reserved.'
) ON CONFLICT DO NOTHING;
