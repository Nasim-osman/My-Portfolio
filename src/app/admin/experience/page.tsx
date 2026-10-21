import { connection } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAdminExperience } from '@/lib/data';
import ExperienceManager from './ExperienceManager';

export const instant = false;

export default async function AdminExperiencePage() {
  await connection();
  await requireAdmin();
  const experience = await getAdminExperience();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Experience</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage your internships, student jobs, volunteer roles, teaching assistantships, and leadership positions.
        </p>
      </div>

      <ExperienceManager initialExperience={experience} />
    </div>
  );
}
