import { connection } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAdminSettings } from '@/lib/data';
import SettingsForm from './SettingsForm';

export const instant = false;

export default async function AdminSettingsPage() {
  await connection();
  await requireAdmin();
  const settings = await getAdminSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Site Settings & SEO</h1>
        <p className="text-sm text-text-secondary mt-1">
          Configure global site title, meta description for search engines, Open Graph preview image, and footer text.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
