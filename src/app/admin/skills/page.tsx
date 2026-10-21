import { connection } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAdminSkills } from '@/lib/data';
import SkillsManager from './SkillsManager';

export const instant = false;

export default async function AdminSkillsPage() {
  await connection();
  await requireAdmin();
  const skills = await getAdminSkills();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Skills & Technologies</h1>
        <p className="text-sm text-text-secondary mt-1">
          Organize your technical proficiencies, tools, research competencies, and soft skills into categories.
        </p>
      </div>

      <SkillsManager initialSkills={skills} />
    </div>
  );
}
