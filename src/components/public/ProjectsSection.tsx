import type { Project } from '@/lib/types';
import { FolderOpen, ExternalLink, Star } from 'lucide-react';
import { Github } from '@/components/common/Icons';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (projects.length === 0) return null;

  const featured = projects.filter((p) => p.is_featured);
  const other = projects.filter((p) => !p.is_featured);

  return (
    <section id="projects" className="section" aria-labelledby="projects-heading">
      <div className="container-main">
        <div className="flex items-center gap-3 mb-8">
          <FolderOpen className="w-6 h-6 text-primary-600" />
          <h2 id="projects-heading" className="text-3xl font-bold text-text-primary">Projects</h2>
        </div>

        {/* Featured projects */}
        {featured.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-primary-600 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Star className="w-4 h-4" /> Featured
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((project) => (
                <ProjectCard key={project.id} project={project} featured />
              ))}
            </div>
          </div>
        )}

        {/* All other projects */}
        {other.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {other.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <article
      className={`card flex flex-col group relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
        featured
          ? 'border-indigo-500/40 dark:border-indigo-500/30 ring-1 ring-indigo-500/20'
          : ''
      }`}
    >
      {featured && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-sm backdrop-blur-sm">
            <Star className="w-3 h-3 fill-amber-500" /> Featured
          </span>
        </div>
      )}

      {project.image_url && (
        <div className="w-full h-48 -mt-7 -mx-7 mb-5 overflow-hidden bg-surface-secondary border-b border-border/60" style={{ width: 'calc(100% + 3.5rem)' }}>
          <img
            src={project.image_url}
            alt={`${project.title} screenshot`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <h3 className="text-lg font-bold text-text-primary group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {project.title}
          </h3>
          {project.category && !featured && (
            <span className="badge text-[11px] flex-shrink-0">{project.category}</span>
          )}
        </div>

        <p className="text-sm text-text-secondary leading-relaxed mb-5">
          {project.short_description}
        </p>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-0.5 text-[11px] font-medium bg-surface-secondary text-text-secondary rounded-md border border-border"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Links */}
      <div className="flex items-center gap-3 pt-3.5 border-t border-border mt-auto">
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors py-1 px-2 rounded hover:bg-surface-secondary"
            aria-label={`View ${project.title} source on GitHub`}
          >
            <Github className="w-3.5 h-3.5" />
            Code
          </a>
        )}
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline ml-auto py-1 px-2 rounded hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-colors"
            aria-label={`View ${project.title} live demo`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Live Demo
          </a>
        )}
      </div>
    </article>
  );
}
