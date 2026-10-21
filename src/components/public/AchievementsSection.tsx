import type { Achievement } from '@/lib/types';
import { Award, ExternalLink, Calendar } from 'lucide-react';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export default function AchievementsSection({ achievements }: AchievementsSectionProps) {
  if (achievements.length === 0) return null;

  return (
    <section id="achievements" className="section relative" aria-labelledby="achievements-heading">
      <div className="container-main">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200/60 dark:border-primary-800/60">
            <Award className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Recognition
            </span>
            <h2 id="achievements-heading" className="text-3xl font-extrabold text-text-primary tracking-tight">
              Achievements & Certifications
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          {achievements.map((item) => (
            <article
              key={item.id}
              className="card flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-3.5 mb-3">
                <div className="p-2.5 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 rounded-xl flex-shrink-0 mt-0.5">
                  <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-text-primary leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mt-0.5">
                    {item.organization}
                  </p>
                  {item.date && (
                    <div className="inline-flex items-center gap-1 text-xs text-text-tertiary mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                    </div>
                  )}
                </div>
              </div>

              {item.description && (
                <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">
                  {item.description}
                </p>
              )}

              {item.credential_url && (
                <div className="pt-3 border-t border-border/70 mt-auto">
                  <a
                    href={item.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline py-1 px-2 -ml-2 rounded-md hover:bg-primary-50 dark:hover:bg-primary-950/40 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Credential
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
