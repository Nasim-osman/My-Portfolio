import { connection } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAdminProjects } from '@/lib/data';
import ProjectsManager from './ProjectsManager';

export const instant = false;

export default async function AdminProjectsPage() {
  await connection();
  await requireAdmin();
  const projects = await getAdminProjects();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
        <p className="text-sm text-text-secondary mt-1">
          Create, edit, reorder, feature, and showcase your software, AI, and engineering projects.
        </p>
      </div>

      <ProjectsManager initialProjects={projects} />
    </div>
  );
}
