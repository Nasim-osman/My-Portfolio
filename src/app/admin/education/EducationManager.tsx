'use client';

import { useState, useTransition } from 'react';
import type { Education } from '@/lib/types';
import {
  saveEducationAction,
  deleteEducationAction,
  toggleEducationPublishAction,
} from '@/app/admin/actions';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function EducationManager({ initialEducation }: { initialEducation: Education[] }) {
  const [items, setItems] = useState<Education[]>(initialEducation);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Education> | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenNew = () => {
    setEditingItem({
      institution: '',
      degree: '',
      department: '',
      start_year: new Date().getFullYear(),
      end_year: new Date().getFullYear() + 4,
      is_current: false,
      cgpa: '',
      description: '',
      achievements: '',
      display_order: items.length + 1,
      is_published: true,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (item: Education) => {
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
      const res = await saveEducationAction(formData);
      if (res?.error) {
        setStatus({ type: 'error', message: res.error });
      } else {
        setStatus({ type: 'success', message: 'Education record saved successfully!' });
        handleClose();
        window.location.reload();
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    setStatus(null);

    startTransition(async () => {
      const res = await deleteEducationAction(id);
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
      const res = await toggleEducationPublishAction(id, current);
      if (res?.error) {
        setStatus({ type: 'error', message: res.error });
      } else {
        setItems(
          items.map((i) => (i.id === id ? { ...i, is_published: !current } : i))
        );
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
          Displaying {items.length} academic qualification{items.length === 1 ? '' : 's'}.
        </p>
        <button onClick={handleOpenNew} className="btn btn-primary btn-sm flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Education
        </button>
      </div>

      {/* Table / List */}
      <div className="card overflow-hidden p-0">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Degree & Institution</th>
              <th>Years</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-text-tertiary">
                  No education records found. Click &quot;Add Education&quot; to create one.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="w-16 font-mono text-xs text-text-tertiary">{item.display_order}</td>
                  <td>
                    <div className="font-medium text-text-primary">{item.degree}</div>
                    <div className="text-xs text-text-secondary">{item.institution}</div>
                  </td>
                  <td className="text-xs text-text-secondary">
                    {item.start_year} - {item.is_current ? 'Present' : item.end_year}
                  </td>
                  <td>
                    <button
                      onClick={() => handleTogglePublish(item.id, item.is_published)}
                      className={`badge cursor-pointer ${
                        item.is_published ? 'status-published' : 'status-draft'
                      }`}
                      title="Click to toggle publish status"
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
                  <td className="text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-text-secondary hover:text-primary-600 rounded"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.degree)}
                      className="p-1.5 text-text-secondary hover:text-red-600 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
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
          <div className="bg-surface rounded-xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-bold text-text-primary mb-4 border-b border-border pb-2">
              {editingItem.id ? 'Edit Education Record' : 'Add Education Record'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <input type="hidden" name="id" value={editingItem.id || ''} />

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Degree / Program *</label>
                  <input
                    name="degree"
                    required
                    className="form-input"
                    placeholder="e.g. B.S. in Computer Science"
                    defaultValue={editingItem.degree}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Institution *</label>
                  <input
                    name="institution"
                    required
                    className="form-input"
                    placeholder="e.g. Stanford University"
                    defaultValue={editingItem.institution}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Department / Major</label>
                  <input
                    name="department"
                    className="form-input"
                    placeholder="e.g. Computer Science Dept."
                    defaultValue={editingItem.department}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CGPA / Grade (Optional)</label>
                  <input
                    name="cgpa"
                    className="form-input"
                    placeholder="e.g. 3.90 / 4.00"
                    defaultValue={editingItem.cgpa || ''}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="form-label">Start Year *</label>
                  <input
                    type="number"
                    name="start_year"
                    required
                    className="form-input"
                    defaultValue={editingItem.start_year}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Year</label>
                  <input
                    type="number"
                    name="end_year"
                    className="form-input"
                    defaultValue={editingItem.end_year || ''}
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
              </div>

              <div className="flex items-center gap-6 py-2">
                <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_current"
                    defaultChecked={editingItem.is_current}
                  />
                  Currently Enrolled / In Progress
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
                <label className="form-label">Description / Coursework</label>
                <textarea
                  name="description"
                  rows={3}
                  className="form-input resize-y"
                  placeholder="Key coursework, thesis topic, or academic focus..."
                  defaultValue={editingItem.description || ''}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Relevant Achievements / Honors</label>
                <textarea
                  name="achievements"
                  rows={2}
                  className="form-input resize-y"
                  placeholder="Dean's List, honors, scholarships..."
                  defaultValue={editingItem.achievements || ''}
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
                  {isPending ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
