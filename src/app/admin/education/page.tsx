import { connection } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAdminEducation } from '@/lib/data';
import EducationManager from './EducationManager';

export const instant = false;

export default async function AdminEducationPage() {
  await connection();
  await requireAdmin();
  const education = await getAdminEducation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Education</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage your university degrees, colleges, coursework, grades, and academic achievements.
        </p>
      </div>

      <EducationManager initialEducation={education} />
    </div>
  );
}
