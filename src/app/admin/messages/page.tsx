import { connection } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAdminContactMessages } from '@/lib/data';
import MessagesManager from './MessagesManager';

export const instant = false;

export default async function AdminMessagesPage() {
  await connection();
  await requireAdmin();
  const messages = await getAdminContactMessages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Contact Messages</h1>
        <p className="text-sm text-text-secondary mt-1">
          Review incoming messages, inquiries, and collaboration requests sent through the public contact form.
        </p>
      </div>

      <MessagesManager initialMessages={messages} />
    </div>
  );
}
