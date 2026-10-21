import { connection } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAdminAchievements } from '@/lib/data';
import AchievementsManager from './AchievementsManager';

export const instant = false;

export default async function AdminAchievementsPage() {
  await connection();
  await requireAdmin();
  const achievements = await getAdminAchievements();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Achievements & Certifications</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage your honors, scholarships, hackathon victories, certifications, and academic awards.
        </p>
      </div>

      <AchievementsManager initialAchievements={achievements} />
    </div>
  );
}
