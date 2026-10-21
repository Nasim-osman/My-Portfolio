import type { Experience } from '@/lib/types';
import { Briefcase, Calendar, CheckCircle2 } from 'lucide-react';

interface ExperienceSectionProps {
  experience: Experience[];
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  if (experience.length === 0) return null;

  return (
    <section id="experience" className="section relative" aria-labelledby="experience-heading">
      <div className="container-main">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200/60 dark:border-primary-800/60">
            <Briefcase className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Work & Roles
            </span>
            <h2 id="experience-heading" className="text-3xl font-extrabold text-text-primary tracking-tight">
              Experience
            </h2>
          </div>
        </div>

        <div className="max-w-4xl space-y-6">
          {experience.map((exp) => (
            <article
              key={exp.id}
              className="card relative pl-6 sm:pl-8 border-l-4 border-l-cyan-500 hover:border-l-cyan-400 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-text-primary">{exp.position}</h3>
                  <p className="text-base font-semibold text-primary-600 dark:text-primary-400">
                    {exp.organization}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                  <span className="badge text-xs uppercase tracking-wide font-semibold">
                    {exp.type}
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-surface-secondary border border-border text-text-secondary">
                    <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                    <span suppressHydrationWarning>
                      {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                    </span>
                  </div>
                </div>
              </div>

              {exp.description && (
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  {exp.description}
                </p>
              )}

              {exp.responsibilities && (
                <div className="mt-3 pt-3 border-t border-border/70 space-y-1.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-2">
                    Key Contributions & Responsibilities
                  </p>
                  <div className="space-y-1.5">
                    {exp.responsibilities.split('\n').filter(Boolean).map((line, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{line.replace(/^[-•*]\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  try {
    const [year, month] = dateStr.split('-');
    if (year && month) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const mIdx = parseInt(month, 10) - 1;
      return `${monthNames[mIdx] || month} ${year}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}
