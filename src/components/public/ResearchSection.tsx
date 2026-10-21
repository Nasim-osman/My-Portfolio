import type { Research } from '@/lib/types';
import { BookOpen, ExternalLink } from 'lucide-react';
import { RESEARCH_STATUS_LABELS } from '@/lib/types';

interface ResearchSectionProps {
  research: Research[];
}

export default function ResearchSection({ research }: ResearchSectionProps) {
  if (research.length === 0) return null;

  const statusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'submitted':
        return 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800';
      case 'in_progress':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'completed':
        return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800';
    }
  };

  return (
    <section id="research" className="section" aria-labelledby="research-heading">
      <div className="container-main">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-6 h-6 text-primary-600" />
          <h2 id="research-heading" className="text-3xl font-bold text-text-primary">Research & Publications</h2>
        </div>

        <div className="max-w-3xl space-y-6">
          {research.map((item) => (
            <article key={item.id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <h3 className="text-lg font-semibold text-text-primary">{item.title}</h3>
                <span className={`badge text-xs ${statusColor(item.status)}`}>
                  {RESEARCH_STATUS_LABELS[item.status] || item.status}
                </span>
              </div>

              {item.research_area && (
                <p className="text-sm text-primary-600 font-medium mb-2">{item.research_area}</p>
              )}

              <p className="text-sm text-text-secondary leading-relaxed mb-3">{item.description}</p>

              {item.authors && (
                <p className="text-sm text-text-secondary">
                  <span className="font-medium">Authors:</span> {item.authors}
                </p>
              )}
              {item.date && (
                <p className="text-sm text-text-tertiary mt-1">{item.date}</p>
              )}

              {item.paper_url && (
                <a
                  href={item.paper_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium mt-3 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Paper
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
