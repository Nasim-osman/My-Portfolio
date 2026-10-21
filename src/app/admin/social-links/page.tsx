import { connection } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAdminSocialLinks } from '@/lib/data';
import SocialLinksManager from './SocialLinksManager';

export const instant = false;

export default async function AdminSocialLinksPage() {
  await connection();
  await requireAdmin();
  const links = await getAdminSocialLinks();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Social & Professional Links</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage your external profiles like GitHub, LinkedIn, Google Scholar, ResearchGate, Twitter, and personal websites.
        </p>
      </div>

      <SocialLinksManager initialLinks={links} />
    </div>
  );
}
