// Database type definitions for the portfolio
// These mirror the Supabase database schema

export interface Profile {
  id: string;
  full_name: string;
  headline: string;
  introduction: string;
  profile_image_url: string | null;
  academic_status: string;
  about_text: string;
  interests: string;
  career_goals: string;
  expertise_areas: string;
  bio: string;
  email: string;
  github_url: string | null;
  linkedin_url: string | null;
  resume_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  department: string;
  start_year: number;
  end_year: number | null;
  is_current: boolean;
  cgpa: string | null;
  description: string | null;
  achievements: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number | null; // 1-5 scale, null means not rated
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  short_description: string;
  detailed_description: string | null;
  technologies: string[];
  image_url: string | null;
  github_url: string | null;
  live_url: string | null;
  category: string;
  start_date: string | null;
  completion_date: string | null;
  is_featured: boolean;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Research {
  id: string;
  title: string;
  description: string;
  research_area: string;
  status: 'in_progress' | 'submitted' | 'published' | 'completed';
  authors: string;
  date: string | null;
  paper_url: string | null;
  relevant_links: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  position: string;
  organization: string;
  type: string; // internship, job, volunteer, leadership, university, etc.
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
  responsibilities: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  date: string | null;
  description: string | null;
  credential_url: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon_name: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  site_title: string;
  site_description: string;
  footer_text: string;
  og_image_url: string | null;
  favicon_url: string | null;
  created_at: string;
  updated_at: string;
}

// Skill categories for organizing
export const SKILL_CATEGORIES = [
  'Programming & Development',
  'AI & Machine Learning',
  'Research & Data Analysis',
  'Tools & Technologies',
  'Communication & Other',
] as const;

// Experience types
export const EXPERIENCE_TYPES = [
  'Internship',
  'Full-time',
  'Part-time',
  'Volunteer',
  'Leadership',
  'University Activity',
  'Organizational Role',
] as const;

// Research statuses
export const RESEARCH_STATUSES = [
  'in_progress',
  'submitted',
  'published',
  'completed',
] as const;

export const RESEARCH_STATUS_LABELS: Record<string, string> = {
  in_progress: 'In Progress',
  submitted: 'Submitted',
  published: 'Published',
  completed: 'Completed',
};
