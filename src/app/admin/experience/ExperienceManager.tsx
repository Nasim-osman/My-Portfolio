'use client';

import { useState, useTransition } from 'react';
import type { Experience } from '@/lib/types';
import { EXPERIENCE_TYPES } from '@/lib/types';
import {
  saveExperienceAction,
  deleteExperienceAction,
  toggleExperiencePublishAction,
} from '@/app/admin/actions';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function ExperienceManager({ initialExperience }: { initialExperience: Experience[] }) {
  const [items, setItems] = useState<Experience[]>(initialExperience);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Experience> | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenNew = () => {
    setEditingItem({
      position: '',
      organization: '',
      type: 'Internship',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      is_current: false,
      description: '',
      responsibilities: '',
      display_order: items.length + 1,
      is_published: true,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (item: Experience) => {
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
      const res = await saveExperienceAction(formData);
      if (res?.error) {
        setStatus({ type: 'error', message: res.error });
      } else {
        setStatus({ type: 'success', message: 'Experience saved successfully!' });
        handleClose();
        window.location.reload();
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete experience "${name}"?`)) return;
    setStatus(null);

    startTransition(async () => {
      const res = await deleteExperienceAction(id);
      if (res?.error) {
        setStatus({ type: 'error', message: res.error });
      } else {
        setItems(items.filter((i) => i.id !== id));
        setStatus({ type: 'success', message: 'Record deleted.' });
      }
    });
  };

  const handleTogglePublish = (id: string, current: boolean) => {
    startTransition(async () => {
      const res = await toggleExperiencePublishAction(id, current);
      if (res?.error) {
        setStatus({ type: 'error', message: res.error });
      } else {
        setItems(items.map((i) => (i.id === id ? { ...i, is_published: !current } : i)));
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
          Displaying {items.length} work, leadership & activity experience{items.length === 1 ? '' : 's'}.
        </p>
        <button onClick={handleOpenNew} className="btn btn-primary btn-sm flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Position & Org</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-text-tertiary">
                  No experience records found. Click &quot;Add Experience&quot; to add your roles.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="w-12 font-mono text-xs text-text-tertiary">{item.display_order}</td>
                  <td>
                    <div className="font-semibold text-text-primary text-sm">{item.position}</div>
                    <div className="text-xs text-primary-600 font-medium">{item.organization}</div>
                  </td>
                  <td>
                    <span className="badge text-xs">{item.type}</span>
                  </td>
                  <td className="text-xs text-text-secondary">
                    {item.start_date} - {item.is_current ? 'Present' : item.end_date}
                  </td>
                  <td>
                    <button
                      onClick={() => handleTogglePublish(item.id, item.is_published)}
                      className={`badge text-xs cursor-pointer ${
                        item.is_published ? 'status-published' : 'status-draft'
                      }`}
                    >
                      {item.is_published ? (
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <EyeOff className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </button>
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
                      onClick={() => handleDelete(item.id, item.position)}
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
          <div className="bg-surface rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-bold text-text-primary mb-4 border-b border-border pb-2">
              {editingItem.id ? 'Edit Experience' : 'Add Experience Entry'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <input type="hidden" name="id" value={editingItem.id || ''} />

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Position / Role Title *</label>
                  <input
                    name="position"
                    required
                    className="form-input"
                    placeholder="e.g. Undergraduate Teaching Assistant"
                    defaultValue={editingItem.position}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Organization / Company *</label>
                  <input
                    name="organization"
                    required
                    className="form-input"
                    placeholder="e.g. Department of Computer Science"
                    defaultValue={editingItem.organization}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Activity / Employment Type</label>
                  <select
                    name="type"
                    className="form-input"
                    defaultValue={editingItem.type || 'Internship'}
                  >
                    {EXPERIENCE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
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
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    name="start_date"
                    required
                    className="form-input"
                    defaultValue={editingItem.start_date || ''}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    className="form-input"
                    defaultValue={editingItem.end_date || ''}
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 py-2">
                <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_current"
                    defaultChecked={editingItem.is_current}
                  />
                  Current Position / Active Role
                </label>

                <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_published"
                    defaultChecked={editingItem.is_published ?? true}
                  />
                  Publish on website
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Summary Description *</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  className="form-input resize-y"
                  placeholder="Overview of your responsibilities, team, or project context..."
                  defaultValue={editingItem.description}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Key Responsibilities / Bullet Points</label>
                <textarea
                  name="responsibilities"
                  rows={4}
                  className="form-input resize-y"
                  placeholder="• Conducted weekly lab sessions for 60+ students.&#10;• Designed automated grading scripts."
                  defaultValue={editingItem.responsibilities || ''}
                />
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
                  {isPending ? 'Saving...' : 'Save Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
