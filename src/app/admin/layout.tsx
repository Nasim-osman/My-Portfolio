import { getAuthUser } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { connection } from 'next/server';
import type { Metadata } from 'next';

export const instant = false;

export const metadata: Metadata = {
  title: 'Admin Dashboard | Portfolio',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const user = await getAuthUser();

  // If no authenticated session exists (e.g. visiting /admin/login), render children directly
  if (!user) {
    return <div className="min-h-screen bg-surface-secondary">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface-secondary">
      <AdminSidebar userEmail={user.email || 'Admin'} />
      <main className="flex-1 p-6 md:p-8 max-w-6xl overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
