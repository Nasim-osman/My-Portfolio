import type { Profile } from '@/lib/types';
import { User, Compass, Target, Sparkles, BookOpen } from 'lucide-react';

interface AboutSectionProps {
  profile: Profile | null;
}

export default function AboutSection({ profile }: AboutSectionProps) {
  if (
    !profile ||
    (!profile.about_text &&
      !profile.interests &&
      !profile.career_goals &&
      !profile.expertise_areas &&
      !profile.bio)
  ) {
    return null;
  }

  const cards = [
    {
      title: 'Interests',
      content: profile.interests,
      icon: Compass,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/60',
      border: 'border-indigo-100 dark:border-indigo-900/50',
    },
    {
      title: 'Career Goals',
      content: profile.career_goals,
      icon: Target,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      border: 'border-emerald-100 dark:border-emerald-900/50',
    },
    {
      title: 'Expertise',
      content: profile.expertise_areas,
      icon: Sparkles,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50 dark:bg-cyan-950/60',
      border: 'border-cyan-100 dark:border-cyan-900/50',
    },
    {
      title: 'Bio & Journey',
      content: profile.bio,
      icon: BookOpen,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/60',
      border: 'border-purple-100 dark:border-purple-900/50',
    },
  ].filter((c) => Boolean(c.content));

  return (
    <section id="about" className="section relative" aria-labelledby="about-heading">
      <div className="container-main">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200/60 dark:border-primary-800/60">
            <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Overview
            </span>
            <h2 id="about-heading" className="text-3xl font-extrabold text-text-primary tracking-tight">
              About Me
            </h2>
          </div>
        </div>

        <div className="max-w-4xl">
          {profile.about_text && (
            <div className="card mb-8 border-l-4 border-l-primary-500 bg-surface/90 backdrop-blur-xs">
              <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                {profile.about_text}
              </p>
            </div>
          )}

          {cards.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-5">
              {cards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="card hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${card.bg} border ${card.border}`}>
                        <Icon className={`w-4 h-4 ${card.color}`} />
                      </div>
                      <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
                        {card.title}
                      </h3>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                      {card.content}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
