'use client';

import { useState, useTransition } from 'react';
import { markMessageReadAction, deleteMessageAction } from '@/app/admin/actions';
import { Mail, CheckCircle, Trash2, MailOpen, AlertCircle, Clock } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read?: boolean;
}

export default function MessagesManager({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSelect = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      startTransition(async () => {
        await markMessageReadAction(msg.id);
        setMessages(messages.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m)));
      });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    setStatus(null);

    startTransition(async () => {
      const res = await deleteMessageAction(id);
      if (res?.error) {
        setStatus({ type: 'error', message: res.error });
      } else {
        setMessages(messages.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
        setStatus({ type: 'success', message: 'Message deleted.' });
      }
    });
  };

  return (
    <div className="space-y-6">
      {status && (
        <div
          className={`alert ${
            status.type === 'success' ? 'alert-success' : 'alert-error'
          } flex items-center gap-2`}
        >
          {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{status.message}</span>
        </div>
      )}

      <p className="text-sm text-text-secondary">
        You have received {messages.length} message{messages.length === 1 ? '' : 's'}.
      </p>

      {messages.length === 0 ? (
        <div className="card text-center py-12">
          <Mail className="w-10 h-10 text-text-tertiary mx-auto mb-3" />
          <h3 className="font-semibold text-text-primary text-base">Inbox is empty</h3>
          <p className="text-sm text-text-secondary mt-1">
            When visitors send you inquiries through the contact form, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-5 gap-6">
          {/* Messages list */}
          <div className="md:col-span-2 card p-0 overflow-hidden divide-y divide-border">
            {messages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <button
                  key={msg.id}
                  onClick={() => handleSelect(msg)}
                  className={`w-full text-left p-4 transition-colors flex flex-col gap-1 ${
                    isSelected ? 'bg-primary-50/70 border-l-4 border-l-primary-600' : 'hover:bg-surface-secondary'
                  } ${!msg.is_read ? 'font-semibold' : ''}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-text-primary truncate">{msg.name}</span>
                    <span className="text-[10px] text-text-tertiary flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-xs text-text-secondary truncate">{msg.email}</span>
                  <p className="text-xs text-text-tertiary truncate mt-1">{msg.message}</p>
                </button>
              );
            })}
          </div>

          {/* Message detail view */}
          <div className="md:col-span-3 card">
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-border pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-text-primary">{selectedMessage.name}</h2>
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: Inquiry from portfolio`}
                      className="text-xs text-primary-600 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Mail className="w-3.5 h-3.5" /> {selectedMessage.email}
                    </a>
                    <span className="text-xs text-text-tertiary block mt-1">
                      Received {new Date(selectedMessage.created_at).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="btn btn-secondary btn-sm text-red-600 hover:bg-red-50"
                    title="Delete message"
                    disabled={isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-surface-secondary p-4 rounded-lg text-sm text-text-primary whitespace-pre-wrap leading-relaxed min-h-[140px]">
                  {selectedMessage.message}
                </div>

                <div className="pt-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Inquiry from portfolio`}
                    className="btn btn-primary btn-sm inline-flex items-center gap-2"
                  >
                    <MailOpen className="w-4 h-4" /> Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-text-tertiary text-sm">
                Select a message from the list to view its contents.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
