import type { Skill } from '@/lib/types';
import { Wrench } from 'lucide-react';

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  if (skills.length === 0) return null;

  // Group skills by category
  const groupedSkills = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  const proficiencyLabel = (level: number | null) => {
    if (!level) return null;
    const labels: Record<number, string> = {
      1: 'Beginner',
      2: 'Elementary',
      3: 'Intermediate',
      4: 'Advanced',
      5: 'Expert',
    };
    return labels[level] || null;
  };

  return (
    <section id="skills" className="section" aria-labelledby="skills-heading">
      <div className="container-main">
        <div className="flex items-center gap-3 mb-8">
          <Wrench className="w-6 h-6 text-primary-600" />
          <h2 id="skills-heading" className="text-3xl font-bold text-text-primary">Skills</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="card hover:border-indigo-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-border">
                <h3 className="text-sm font-bold text-text-primary tracking-wide">
                  {category}
                </h3>
                <span className="text-[11px] font-semibold text-text-tertiary">
                  {categorySkills.length} skills
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary hover:bg-surface border border-border hover:border-primary-500/40 text-text-primary transition-all duration-200 shadow-xs"
                    title={proficiencyLabel(skill.proficiency) || undefined}
                  >
                    <span>{skill.name}</span>
                    {skill.proficiency && (
                      <span className="flex items-center gap-0.5 ml-1" aria-hidden="true">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              i < skill.proficiency!
                                ? 'bg-indigo-600 dark:bg-indigo-400'
                                : 'bg-border dark:bg-slate-700'
                            }`}
                          />
                        ))}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
