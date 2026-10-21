import { createClient, createPublicClient, isSupabaseConfigured } from '@/lib/supabase/server';
import type {
  Profile,
  Education,
  Skill,
  Project,
  Research,
  Experience,
  Achievement,
  SocialLink,
  SiteSettings,
} from '@/lib/types';
import {
  PLACEHOLDER_PROFILE,
  PLACEHOLDER_EDUCATION,
  PLACEHOLDER_SKILLS,
  PLACEHOLDER_PROJECTS,
  PLACEHOLDER_RESEARCH,
  PLACEHOLDER_EXPERIENCE,
  PLACEHOLDER_ACHIEVEMENTS,
  PLACEHOLDER_SOCIAL_LINKS,
  PLACEHOLDER_SETTINGS,
} from './placeholders';

// ============================================================
// Public data fetching (published content, with fallback)
// ============================================================

export async function getProfile(): Promise<Profile> {
  if (!isSupabaseConfigured()) {
    return PLACEHOLDER_PROFILE;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return PLACEHOLDER_PROFILE;
    }
    return data;
  } catch {
    return PLACEHOLDER_PROFILE;
  }
}

export async function getEducation(): Promise<Education[]> {
  if (!isSupabaseConfigured()) {
    return PLACEHOLDER_EDUCATION;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return PLACEHOLDER_EDUCATION;
    }
    return data;
  } catch {
    return PLACEHOLDER_EDUCATION;
  }
}

export async function getSkills(): Promise<Skill[]> {
  if (!isSupabaseConfigured()) {
    return PLACEHOLDER_SKILLS;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('is_published', true)
      .order('category')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return PLACEHOLDER_SKILLS;
    }
    return data;
  } catch {
    return PLACEHOLDER_SKILLS;
  }
}

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return PLACEHOLDER_PROJECTS;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return PLACEHOLDER_PROJECTS;
    }
    return data;
  } catch {
    return PLACEHOLDER_PROJECTS;
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const allProjects = await getProjects();
  const featured = allProjects.filter((p) => p.is_featured);
  return featured.length > 0 ? featured : allProjects.slice(0, 3);
}

export async function getResearch(): Promise<Research[]> {
  if (!isSupabaseConfigured()) {
    return PLACEHOLDER_RESEARCH;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('research')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return PLACEHOLDER_RESEARCH;
    }
    return data;
  } catch {
    return PLACEHOLDER_RESEARCH;
  }
}

export async function getExperience(): Promise<Experience[]> {
  if (!isSupabaseConfigured()) {
    return PLACEHOLDER_EXPERIENCE;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return PLACEHOLDER_EXPERIENCE;
    }
    return data;
  } catch {
    return PLACEHOLDER_EXPERIENCE;
  }
}

export async function getAchievements(): Promise<Achievement[]> {
  if (!isSupabaseConfigured()) {
    return PLACEHOLDER_ACHIEVEMENTS;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return PLACEHOLDER_ACHIEVEMENTS;
    }
    return data;
  } catch {
    return PLACEHOLDER_ACHIEVEMENTS;
  }
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  if (!isSupabaseConfigured()) {
    return PLACEHOLDER_SOCIAL_LINKS;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return PLACEHOLDER_SOCIAL_LINKS;
    }
    return data;
  } catch {
    return PLACEHOLDER_SOCIAL_LINKS;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) {
    return PLACEHOLDER_SETTINGS;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return PLACEHOLDER_SETTINGS;
    }
    return data;
  } catch {
    return PLACEHOLDER_SETTINGS;
  }
}

// ============================================================
// Admin data fetching (all content, including drafts)
// ============================================================

export async function getAdminProfile(): Promise<Profile> {
  return await getProfile();
}

export async function getAdminEducation(): Promise<Education[]> {
  if (!isSupabaseConfigured()) {
    return PLACEHOLDER_EDUCATION;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('getAdminEducation error:', error.message);
    return PLACEHOLDER_EDUCATION;
  }
  return data ?? [];
}

export async function getAdminSkills(): Promise<Skill[]> {
  if (!isSupabaseConfigured()) {
    return PLACEHOLDER_SKILLS;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('category')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('getAdminSkills error:', error.message);
    return PLACEHOLDER_SKILLS;
  }
  return data ?? [];
}

export async function getAdminProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return PLACEHOLDER_PROJECTS;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('getAdminProjects error:', error.message);
    return PLACEHOLDER_PROJECTS;
  }
  return data ?? [];
}

export async function getAdminResearch(): Promise<Research[]> {
  if (!isSupabaseConfigured()) {
    return PLACEHOLDER_RESEARCH;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('research')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('getAdminResearch error:', error.message);
    return PLACEHOLDER_RESEARCH;
  }
  return data ?? [];
}

export async function getAdminExperience(): Promise<Experience[]> {
  if (!isSupabaseConfigured()) {
    return PLACEHOLDER_EXPERIENCE;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('getAdminExperience error:', error.message);
    return PLACEHOLDER_EXPERIENCE;
  }
  return data ?? [];
}

export async function getAdminAchievements(): Promise<Achievement[]> {
  if (!isSupabaseConfigured()) {
    return PLACEHOLDER_ACHIEVEMENTS;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('getAdminAchievements error:', error.message);
    return PLACEHOLDER_ACHIEVEMENTS;
  }
  return data ?? [];
}

export async function getAdminSocialLinks(): Promise<SocialLink[]> {
  if (!isSupabaseConfigured()) {
    return PLACEHOLDER_SOCIAL_LINKS;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('getAdminSocialLinks error:', error.message);
    return PLACEHOLDER_SOCIAL_LINKS;
  }
  return data ?? [];
}

export async function getAdminSettings(): Promise<SiteSettings> {
  return await getSiteSettings();
}

export async function getAdminContactMessages() {
  if (!isSupabaseConfigured()) {
    return [];
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return [];
  }
  return data ?? [];
}
