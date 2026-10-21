import type { Education } from '@/lib/types';
import { GraduationCap, Calendar, Award } from 'lucide-react';

interface EducationSectionProps {
  education: Education[];
}

export default function EducationSection({ education }: EducationSectionProps) {
  if (education.length === 0) return null;

  return (
    <section id="education" className="section relative" aria-labelledby="education-heading">
      <div className="container-main">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200/60 dark:border-primary-800/60">
            <GraduationCap className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Academic Background
            </span>
            <h2 id="education-heading" className="text-3xl font-extrabold text-text-primary tracking-tight">
              Education
            </h2>
          </div>
        </div>

        <div className="max-w-4xl space-y-6">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="card relative pl-6 sm:pl-8 border-l-4 border-l-indigo-500 hover:border-l-indigo-400 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-text-primary">
                    {edu.degree}
                  </h3>
                  <p className="text-base font-semibold text-primary-600 dark:text-primary-400">
                    {edu.institution}
                  </p>
                  {edu.department && (
                    <p className="text-sm text-text-secondary mt-0.5">{edu.department}</p>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-surface-secondary border border-border text-text-secondary">
                    <Calendar className="w-3.5 h-3.5 text-primary-500" />
                    <span>
                      {edu.start_year} — {edu.is_current ? 'Present' : edu.end_year}
                    </span>
                  </div>
                  {edu.cgpa && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      CGPA: {edu.cgpa}
                    </span>
                  )}
                </div>
              </div>

              {edu.description && (
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  {edu.description}
                </p>
              )}

              {edu.achievements && (
                <div className="flex items-start gap-2 pt-2 border-t border-border/70 text-xs sm:text-sm text-text-secondary">
                  <Award className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-text-primary font-semibold">Honors & Achievements: </strong>
                    {edu.achievements}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
