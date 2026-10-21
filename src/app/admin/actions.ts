'use server';

import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// ============================================================
// PROFILE ACTIONS
// ============================================================

export async function updateProfileAction(formData: FormData) {
  await requireAdmin();
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase is not configured. Please configure your environment variables.' };
  }

  const id = formData.get('id') as string | null;
  const full_name = (formData.get('full_name') as string)?.trim();
  const headline = (formData.get('headline') as string)?.trim() || '';
  const introduction = (formData.get('introduction') as string)?.trim() || '';
  const academic_status = (formData.get('academic_status') as string)?.trim() || '';
  const about_text = (formData.get('about_text') as string)?.trim() || '';
  const interests = (formData.get('interests') as string)?.trim() || '';
  const career_goals = (formData.get('career_goals') as string)?.trim() || '';
  const expertise_areas = (formData.get('expertise_areas') as string)?.trim() || '';
  const bio = (formData.get('bio') as string)?.trim() || '';
  const email = (formData.get('email') as string)?.trim() || '';
  const github_url = (formData.get('github_url') as string)?.trim() || null;
  const linkedin_url = (formData.get('linkedin_url') as string)?.trim() || null;
  const resume_url = (formData.get('resume_url') as string)?.trim() || null;
  const profile_image_url = (formData.get('profile_image_url') as string)?.trim() || null;

  if (!full_name) {
    return { error: 'Full name is required.' };
  }

  const supabase = await createClient();

  const payload = {
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
    linkedin_url,
    resume_url,
    profile_image_url,
    updated_at: new Date().toISOString(),
  };

  let error;
  if (id && id !== 'placeholder-profile-id') {
    const res = await supabase.from('profiles').update(payload).eq('id', id);
    error = res.error;
  } else {
    // Check if an existing profile row exists
    const { data: existing } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
    if (existing) {
      const res = await supabase.from('profiles').update(payload).eq('id', existing.id);
      error = res.error;
    } else {
      const res = await supabase.from('profiles').insert(payload);
      error = res.error;
    }
  }

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/profile');
  return { success: true };
}

// ============================================================
// EDUCATION ACTIONS
// ============================================================

export async function saveEducationAction(formData: FormData) {
  await requireAdmin();
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase is not configured.' };
  }

  const id = formData.get('id') as string | null;
  const institution = (formData.get('institution') as string)?.trim();
  const degree = (formData.get('degree') as string)?.trim();
  const department = (formData.get('department') as string)?.trim() || '';
  const start_year = parseInt(formData.get('start_year') as string, 10);
  const endYearRaw = formData.get('end_year') as string;
  const end_year = endYearRaw ? parseInt(endYearRaw, 10) : null;
  const is_current = formData.get('is_current') === 'on' || formData.get('is_current') === 'true';
  const cgpa = (formData.get('cgpa') as string)?.trim() || null;
  const description = (formData.get('description') as string)?.trim() || null;
  const achievements = (formData.get('achievements') as string)?.trim() || null;
  const display_order = parseInt((formData.get('display_order') as string) || '0', 10);
  const is_published = formData.get('is_published') === 'on' || formData.get('is_published') === 'true';

  if (!institution || !degree || isNaN(start_year)) {
    return { error: 'Institution, Degree, and Start Year are required.' };
  }

  const supabase = await createClient();
  const payload = {
    institution,
    degree,
    department,
    start_year,
    end_year: is_current ? null : end_year,
    is_current,
    cgpa,
    description,
    achievements,
    display_order,
    is_published,
    updated_at: new Date().toISOString(),
  };

  let error;
  if (id && !id.startsWith('placeholder-')) {
    const res = await supabase.from('education').update(payload).eq('id', id);
    error = res.error;
  } else {
    const res = await supabase.from('education').insert(payload);
    error = res.error;
  }

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/education');
  return { success: true };
}

export async function deleteEducationAction(id: string) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const supabase = await createClient();
  const { error } = await supabase.from('education').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/education');
  return { success: true };
}

export async function toggleEducationPublishAction(id: string, currentStatus: boolean) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('education')
    .update({ is_published: !currentStatus })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/education');
  return { success: true };
}

// ============================================================
// SKILLS ACTIONS
// ============================================================

export async function saveSkillAction(formData: FormData) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const id = formData.get('id') as string | null;
  const name = (formData.get('name') as string)?.trim();
  const category = (formData.get('category') as string)?.trim();
  const profRaw = formData.get('proficiency') as string;
  const proficiency = profRaw ? parseInt(profRaw, 10) : null;
  const display_order = parseInt((formData.get('display_order') as string) || '0', 10);
  const is_published = formData.get('is_published') === 'on' || formData.get('is_published') === 'true';

  if (!name || !category) {
    return { error: 'Skill name and Category are required.' };
  }

  const supabase = await createClient();
  const payload = {
    name,
    category,
    proficiency,
    display_order,
    is_published,
    updated_at: new Date().toISOString(),
  };

  let error;
  if (id && !id.startsWith('skill-')) {
    const res = await supabase.from('skills').update(payload).eq('id', id);
    error = res.error;
  } else {
    const res = await supabase.from('skills').insert(payload);
    error = res.error;
  }

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/skills');
  return { success: true };
}

export async function deleteSkillAction(id: string) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const supabase = await createClient();
  const { error } = await supabase.from('skills').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/skills');
  return { success: true };
}

export async function toggleSkillPublishAction(id: string, currentStatus: boolean) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('skills')
    .update({ is_published: !currentStatus })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/skills');
  return { success: true };
}

// ============================================================
// PROJECTS ACTIONS
// ============================================================

export async function saveProjectAction(formData: FormData) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const id = formData.get('id') as string | null;
  const title = (formData.get('title') as string)?.trim();
  const short_description = (formData.get('short_description') as string)?.trim();
  const detailed_description = (formData.get('detailed_description') as string)?.trim() || null;
  const techRaw = (formData.get('technologies') as string)?.trim() || '';
  const technologies = techRaw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  const image_url = (formData.get('image_url') as string)?.trim() || null;
  const github_url = (formData.get('github_url') as string)?.trim() || null;
  const live_url = (formData.get('live_url') as string)?.trim() || null;
  const category = (formData.get('category') as string)?.trim() || 'General';
  const start_date = (formData.get('start_date') as string)?.trim() || null;
  const completion_date = (formData.get('completion_date') as string)?.trim() || null;
  const is_featured = formData.get('is_featured') === 'on' || formData.get('is_featured') === 'true';
  const display_order = parseInt((formData.get('display_order') as string) || '0', 10);
  const is_published = formData.get('is_published') === 'on' || formData.get('is_published') === 'true';

  if (!title || !short_description) {
    return { error: 'Project title and Short description are required.' };
  }

  const supabase = await createClient();
  const payload = {
    title,
    short_description,
    detailed_description,
    technologies,
    image_url,
    github_url,
    live_url,
    category,
    start_date,
    completion_date,
    is_featured,
    display_order,
    is_published,
    updated_at: new Date().toISOString(),
  };

  let error;
  if (id && !id.startsWith('placeholder-')) {
    const res = await supabase.from('projects').update(payload).eq('id', id);
    error = res.error;
  } else {
    const res = await supabase.from('projects').insert(payload);
    error = res.error;
  }

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/projects');
  return { success: true };
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const supabase = await createClient();
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/projects');
  return { success: true };
}

export async function toggleProjectFeaturedAction(id: string, currentStatus: boolean) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('projects')
    .update({ is_featured: !currentStatus })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/projects');
  return { success: true };
}

export async function toggleProjectPublishAction(id: string, currentStatus: boolean) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('projects')
    .update({ is_published: !currentStatus })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/projects');
  return { success: true };
}

// ============================================================
// RESEARCH ACTIONS
// ============================================================

export async function saveResearchAction(formData: FormData) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const id = formData.get('id') as string | null;
  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const research_area = (formData.get('research_area') as string)?.trim() || '';
  const status = ((formData.get('status') as string) || 'in_progress') as
    | 'in_progress'
    | 'submitted'
    | 'published'
    | 'completed';
  const authors = (formData.get('authors') as string)?.trim() || '';
  const date = (formData.get('date') as string)?.trim() || null;
  const paper_url = (formData.get('paper_url') as string)?.trim() || null;
  const relevant_links = (formData.get('relevant_links') as string)?.trim() || null;
  const display_order = parseInt((formData.get('display_order') as string) || '0', 10);
  const is_published = formData.get('is_published') === 'on' || formData.get('is_published') === 'true';

  if (!title || !description) {
    return { error: 'Research title and description are required.' };
  }

  const supabase = await createClient();
  const payload = {
    title,
    description,
    research_area,
    status,
    authors,
    date,
    paper_url,
    relevant_links,
    display_order,
    is_published,
    updated_at: new Date().toISOString(),
  };

  let error;
  if (id && !id.startsWith('placeholder-')) {
    const res = await supabase.from('research').update(payload).eq('id', id);
    error = res.error;
  } else {
    const res = await supabase.from('research').insert(payload);
    error = res.error;
  }

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/research');
  return { success: true };
}

export async function deleteResearchAction(id: string) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const supabase = await createClient();
  const { error } = await supabase.from('research').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/research');
  return { success: true };
}

export async function toggleResearchPublishAction(id: string, currentStatus: boolean) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('research')
    .update({ is_published: !currentStatus })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/research');
  return { success: true };
}

// ============================================================
// EXPERIENCE ACTIONS
// ============================================================

export async function saveExperienceAction(formData: FormData) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const id = formData.get('id') as string | null;
  const position = (formData.get('position') as string)?.trim();
  const organization = (formData.get('organization') as string)?.trim();
  const type = (formData.get('type') as string)?.trim() || 'Internship';
  const start_date = (formData.get('start_date') as string)?.trim();
  const end_date = (formData.get('end_date') as string)?.trim() || null;
  const is_current = formData.get('is_current') === 'on' || formData.get('is_current') === 'true';
  const description = (formData.get('description') as string)?.trim();
  const responsibilities = (formData.get('responsibilities') as string)?.trim() || null;
  const display_order = parseInt((formData.get('display_order') as string) || '0', 10);
  const is_published = formData.get('is_published') === 'on' || formData.get('is_published') === 'true';

  if (!position || !organization || !start_date || !description) {
    return { error: 'Position, Organization, Start date, and Description are required.' };
  }

  const supabase = await createClient();
  const payload = {
    position,
    organization,
    type,
    start_date,
    end_date: is_current ? null : end_date,
    is_current,
    description,
    responsibilities,
    display_order,
    is_published,
    updated_at: new Date().toISOString(),
  };

  let error;
  if (id && !id.startsWith('placeholder-')) {
    const res = await supabase.from('experience').update(payload).eq('id', id);
    error = res.error;
  } else {
    const res = await supabase.from('experience').insert(payload);
    error = res.error;
  }

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/experience');
  return { success: true };
}

export async function deleteExperienceAction(id: string) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const supabase = await createClient();
  const { error } = await supabase.from('experience').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/experience');
  return { success: true };
}

export async function toggleExperiencePublishAction(id: string, currentStatus: boolean) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('experience')
    .update({ is_published: !currentStatus })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/experience');
  return { success: true };
}

// ============================================================
// ACHIEVEMENTS ACTIONS
// ============================================================

export async function saveAchievementAction(formData: FormData) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const id = formData.get('id') as string | null;
  const title = (formData.get('title') as string)?.trim();
  const organization = (formData.get('organization') as string)?.trim();
  const date = (formData.get('date') as string)?.trim() || null;
  const description = (formData.get('description') as string)?.trim() || null;
  const credential_url = (formData.get('credential_url') as string)?.trim() || null;
  const display_order = parseInt((formData.get('display_order') as string) || '0', 10);
  const is_published = formData.get('is_published') === 'on' || formData.get('is_published') === 'true';

  if (!title || !organization) {
    return { error: 'Achievement Title and Organization are required.' };
  }

  const supabase = await createClient();
  const payload = {
    title,
    organization,
    date,
    description,
    credential_url,
    display_order,
    is_published,
    updated_at: new Date().toISOString(),
  };

  let error;
  if (id && !id.startsWith('placeholder-')) {
    const res = await supabase.from('achievements').update(payload).eq('id', id);
    error = res.error;
  } else {
    const res = await supabase.from('achievements').insert(payload);
    error = res.error;
  }

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/achievements');
  return { success: true };
}

export async function deleteAchievementAction(id: string) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const supabase = await createClient();
  const { error } = await supabase.from('achievements').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/achievements');
  return { success: true };
}

export async function toggleAchievementPublishAction(id: string, currentStatus: boolean) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('achievements')
    .update({ is_published: !currentStatus })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/achievements');
  return { success: true };
}

// ============================================================
// SOCIAL LINKS ACTIONS
// ============================================================

export async function saveSocialLinkAction(formData: FormData) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const id = formData.get('id') as string | null;
  const platform = (formData.get('platform') as string)?.trim();
  const url = (formData.get('url') as string)?.trim();
  const icon_name = (formData.get('icon_name') as string)?.trim() || null;
  const display_order = parseInt((formData.get('display_order') as string) || '0', 10);
  const is_published = formData.get('is_published') === 'on' || formData.get('is_published') === 'true';

  if (!platform || !url) {
    return { error: 'Platform and URL are required.' };
  }

  const supabase = await createClient();
  const payload = {
    platform,
    url,
    icon_name,
    display_order,
    is_published,
    updated_at: new Date().toISOString(),
  };

  let error;
  if (id && !id.startsWith('social-')) {
    const res = await supabase.from('social_links').update(payload).eq('id', id);
    error = res.error;
  } else {
    const res = await supabase.from('social_links').insert(payload);
    error = res.error;
  }

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/social-links');
  return { success: true };
}

export async function deleteSocialLinkAction(id: string) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const supabase = await createClient();
  const { error } = await supabase.from('social_links').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/social-links');
  return { success: true };
}

// ============================================================
// SETTINGS ACTIONS
// ============================================================

export async function saveSiteSettingsAction(formData: FormData) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const id = formData.get('id') as string | null;
  const site_title = (formData.get('site_title') as string)?.trim() || 'Portfolio';
  const site_description = (formData.get('site_description') as string)?.trim() || '';
  const footer_text = (formData.get('footer_text') as string)?.trim() || '';
  const og_image_url = (formData.get('og_image_url') as string)?.trim() || null;
  const favicon_url = (formData.get('favicon_url') as string)?.trim() || null;

  const supabase = await createClient();
  const payload = {
    site_title,
    site_description,
    footer_text,
    og_image_url,
    favicon_url,
    updated_at: new Date().toISOString(),
  };

  let error;
  if (id && id !== 'placeholder-settings-id') {
    const res = await supabase.from('site_settings').update(payload).eq('id', id);
    error = res.error;
  } else {
    const { data: existing } = await supabase.from('site_settings').select('id').limit(1).maybeSingle();
    if (existing) {
      const res = await supabase.from('site_settings').update(payload).eq('id', existing.id);
      error = res.error;
    } else {
      const res = await supabase.from('site_settings').insert(payload);
      error = res.error;
    }
  }

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/settings');
  return { success: true };
}

// ============================================================
// CONTACT MESSAGES ACTIONS
// ============================================================

export async function markMessageReadAction(id: string) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const supabase = await createClient();
  const { error } = await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/messages');
  return { success: true };
}

export async function deleteMessageAction(id: string) {
  await requireAdmin();
  if (!isSupabaseConfigured()) return { error: 'Supabase is not configured.' };

  const supabase = await createClient();
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/messages');
  return { success: true };
}
