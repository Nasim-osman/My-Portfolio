import { ArrowRight, Mail, FileText } from 'lucide-react';
import { Github, Linkedin } from '@/components/common/Icons';
import type { Profile, SocialLink } from '@/lib/types';

interface HeroSectionProps {
  profile: Profile | null;
  socialLinks: SocialLink[];
}

function cleanBrackets(text: string | null | undefined): string {
  if (!text) return '';
  const trimmed = text.trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

export default function HeroSection({ profile, socialLinks }: HeroSectionProps) {
  if (!profile) {
    return (
      <section id="home" className="section">
        <div className="container-main text-center py-20">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Welcome</h1>
          <p className="text-text-secondary">
            Portfolio content will appear here once configured through the admin dashboard.
          </p>
        </div>
      </section>
    );
  }

  const github = socialLinks.find((l) => l.platform.toLowerCase() === 'github');
  const linkedin = socialLinks.find((l) => l.platform.toLowerCase() === 'linkedin');
  const academicStatus = cleanBrackets(profile.academic_status);
  const headline = cleanBrackets(profile.headline);

  return (
    <section id="home" className="section pt-12 md:pt-20 pb-16 md:pb-24">
      <div className="container-main">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-left">
            {academicStatus && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950/60 border border-primary-200/80 dark:border-primary-800/80 text-primary-700 dark:text-primary-300 shadow-sm mb-5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{academicStatus}</span>
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary mb-4 tracking-tight leading-[1.1]">
              Hi, I&apos;m <span className="text-indigo-600 dark:text-indigo-400">{profile.full_name}</span>
            </h1>

            {headline && (
              <p className="text-lg sm:text-xl md:text-2xl text-text-secondary font-medium mb-5 max-w-2xl leading-snug">
                {headline}
              </p>
            )}

            {profile.introduction && (
              <p className="text-base sm:text-lg text-text-secondary/90 mb-8 max-w-2xl leading-relaxed">
                {profile.introduction}
              </p>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap gap-3.5 justify-center lg:justify-start mb-8">
              <a href="#projects" className="btn btn-primary text-sm sm:text-base group">
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#contact" className="btn btn-secondary text-sm sm:text-base">
                <Mail className="w-4 h-4 text-primary-500" />
                <span>Contact Me</span>
              </a>
              {profile.resume_url && (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary text-sm sm:text-base text-primary-600 dark:text-primary-400 font-semibold gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download CV</span>
                </a>
              )}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4 justify-center lg:justify-start text-text-secondary">
              <span className="text-xs uppercase tracking-wider font-semibold text-text-tertiary">
                Connect
              </span>
              <div className="h-4 w-px bg-border" />
              {github && (
                <a
                  href={github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm hover:text-text-primary transition-colors py-1 px-2 rounded-md hover:bg-surface-secondary"
                  aria-label="GitHub profile"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm hover:text-text-primary transition-colors py-1 px-2 rounded-md hover:bg-surface-secondary"
                  aria-label="LinkedIn profile"
                >
                  <Linkedin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>

          {/* Profile photo */}
          {profile.profile_image_url && (
            <div className="flex-shrink-0">
              <div className="w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-surface shadow-xl ring-2 ring-border/80 bg-surface">
                <img
                  src={profile.profile_image_url}
                  alt={`${profile.full_name}'s profile photo`}
                  className="w-full h-full object-cover rounded-full hover:scale-105 transition-transform duration-300"
                  loading="eager"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
