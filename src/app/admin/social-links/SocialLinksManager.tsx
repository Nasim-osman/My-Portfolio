'use client';

import { useState, useTransition } from 'react';
import type { SocialLink } from '@/lib/types';
import {
  saveSocialLinkAction,
  deleteSocialLinkAction,
} from '@/app/admin/actions';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Eye, EyeOff, ExternalLink } from 'lucide-react';

export default function SocialLinksManager({ initialLinks }: { initialLinks: SocialLink[] }) {
  const [items, setItems] = useState<SocialLink[]>(initialLinks);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<SocialLink> | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenNew = () => {
    setEditingItem({
      platform: '',
      url: '',
      display_order: items.length + 1,
      is_published: true,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (item: SocialLink) => {
    setEditingItem({ ...item });
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
    setEditingItem(null);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await saveSocialLinkAction(formData);
      if (res?.error) {
        setStatus({ type: 'error', message: res.error });
      } else {
        setStatus({ type: 'success', message: 'Social link saved successfully!' });
        handleClose();
        window.location.reload();
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete link for "${name}"?`)) return;
    setStatus(null);

    startTransition(async () => {
      const res = await deleteSocialLinkAction(id);
      if (res?.error) {
        setStatus({ type: 'error', message: res.error });
      } else {
        setItems(items.filter((i) => i.id !== id));
        setStatus({ type: 'success', message: 'Link deleted.' });
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          Displaying {items.length} social & academic profile link{items.length === 1 ? '' : 's'}.
        </p>
        <button onClick={handleOpenNew} className="btn btn-primary btn-sm flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Link
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Platform</th>
              <th>Destination URL</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-text-tertiary">
                  No social links created. Click &quot;Add Link&quot; to connect your profiles.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="w-12 font-mono text-xs text-text-tertiary">{item.display_order}</td>
                  <td className="font-semibold text-text-primary text-sm">{item.platform}</td>
                  <td>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary-600 hover:underline flex items-center gap-1 truncate max-w-xs"
                    >
                      {item.url} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </td>
                  <td>
                    <span className={`badge text-xs ${item.is_published ? 'status-published' : 'status-draft'}`}>
                      {item.is_published ? (
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <EyeOff className="w-3 h-3" /> Hidden
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="text-right space-x-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1 text-text-secondary hover:text-primary-600"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.platform)}
                      className="p-1 text-text-secondary hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit / Create Modal */}
      {isEditing && editingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-text-primary mb-4 border-b border-border pb-2">
              {editingItem.id ? 'Edit Social Link' : 'Add Social / Professional Link'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <input type="hidden" name="id" value={editingItem.id || ''} />

              <div className="form-group">
                <label className="form-label">Platform Name *</label>
                <input
                  name="platform"
                  required
                  className="form-input"
                  placeholder="e.g. GitHub, LinkedIn, Google Scholar, X / Twitter"
                  defaultValue={editingItem.platform}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Profile / Destination URL *</label>
                <input
                  name="url"
                  type="url"
                  required
                  className="form-input"
                  placeholder="https://..."
                  defaultValue={editingItem.url}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Display Order</label>
                <input
                  type="number"
                  name="display_order"
                  className="form-input"
                  defaultValue={editingItem.display_order}
                />
              </div>

              <div className="py-2">
                <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_published"
                    defaultChecked={editingItem.is_published ?? true}
                  />
                  Publish on website
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-secondary btn-sm"
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={isPending}>
                  {isPending ? 'Saving...' : 'Save Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
