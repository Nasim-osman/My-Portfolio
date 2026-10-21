import {
  getProfile,
  getEducation,
  getSkills,
  getProjects,
  getResearch,
  getExperience,
  getAchievements,
  getSocialLinks,
  getSiteSettings,
} from '@/lib/data';
import Header from '@/components/public/Header';
import HeroSection from '@/components/public/HeroSection';
import AboutSection from '@/components/public/AboutSection';
import EducationSection from '@/components/public/EducationSection';
import SkillsSection from '@/components/public/SkillsSection';
import ProjectsSection from '@/components/public/ProjectsSection';
import ResearchSection from '@/components/public/ResearchSection';
import ExperienceSection from '@/components/public/ExperienceSection';
import AchievementsSection from '@/components/public/AchievementsSection';
import ContactSection from '@/components/public/ContactSection';
import Footer from '@/components/public/Footer';
import { connection } from 'next/server';
import type { Metadata } from 'next';


export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const [profile, settings] = await Promise.all([getProfile(), getSiteSettings()]);
  const title = settings?.site_title || `${profile.full_name} | Portfolio`;
  const description = settings?.site_description || profile.introduction || profile.headline;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: settings?.og_image_url ? [{ url: settings.og_image_url }] : [],
    },
  };
}

export default async function HomePage() {
  await connection();
  const [
    profile,
    education,
    skills,
    projects,
    research,
    experience,
    achievements,
    socialLinks,
  ] = await Promise.all([
    getProfile(),
    getEducation(),
    getSkills(),
    getProjects(),
    getResearch(),
    getExperience(),
    getAchievements(),
    getSocialLinks(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main id="main-content" className="flex-1">
        <HeroSection profile={profile} socialLinks={socialLinks} />
        <AboutSection profile={profile} />
        <EducationSection education={education} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <ResearchSection research={research} />
        <ExperienceSection experience={experience} />
        <AchievementsSection achievements={achievements} />
        <ContactSection profile={profile} socialLinks={socialLinks} />
      </main>
      <Footer profile={profile} socialLinks={socialLinks} />
    </div>
  );
}
