import { connection } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAdminProfile } from '@/lib/data';
import ProfileForm from './ProfileForm';

export const instant = false;

export default async function AdminProfilePage() {
  await connection();
  await requireAdmin();
  const profile = await getAdminProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Profile & Bio</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage your personal identity, hero section headlines, academic standing, and bio.
        </p>
      </div>

      <ProfileForm initialProfile={profile} />
    </div>
  );
}
