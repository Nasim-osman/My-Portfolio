import { connection } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAdminResearch } from '@/lib/data';
import ResearchManager from './ResearchManager';

export const instant = false;

export default async function AdminResearchPage() {
  await connection();
  await requireAdmin();
  const research = await getAdminResearch();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Research & Publications</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage your academic papers, preprints, in-progress investigations, abstracts, and co-authors.
        </p>
      </div>

      <ResearchManager initialResearch={research} />
    </div>
  );
}
