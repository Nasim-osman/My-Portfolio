'use client';

import { useState, useTransition } from 'react';
import type { Skill } from '@/lib/types';
import { SKILL_CATEGORIES } from '@/lib/types';
import {
  saveSkillAction,
  deleteSkillAction,
  toggleSkillPublishAction,
} from '@/app/admin/actions';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function SkillsManager({ initialSkills }: { initialSkills: Skill[] }) {
  const [items, setItems] = useState<Skill[]>(initialSkills);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Skill> | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenNew = () => {
    setEditingItem({
      name: '',
      category: SKILL_CATEGORIES[0],
      proficiency: 4,
      display_order: items.length + 1,
      is_published: true,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (item: Skill) => {
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
      const res = await saveSkillAction(formData);
      if (res?.error) {
        setStatus({ type: 'error', message: res.error });
      } else {
        setStatus({ type: 'success', message: 'Skill saved successfully!' });
        handleClose();
        window.location.reload();
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete skill "${name}"?`)) return;
    setStatus(null);

    startTransition(async () => {
      const res = await deleteSkillAction(id);
      if (res?.error) {
        setStatus({ type: 'error', message: res.error });
      } else {
        setItems(items.filter((i) => i.id !== id));
        setStatus({ type: 'success', message: 'Skill deleted.' });
      }
    });
  };

  const handleTogglePublish = (id: string, current: boolean) => {
    startTransition(async () => {
      const res = await toggleSkillPublishAction(id, current);
      if (res?.error) {
        setStatus({ type: 'error', message: res.error });
      } else {
        setItems(items.map((i) => (i.id === id ? { ...i, is_published: !current } : i)));
      }
    });
  };

  // Group by category for visual organization
  const grouped = items.reduce<Record<string, Skill[]>>((acc, s) => {
    const cat = s.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

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
          Displaying {items.length} skill{items.length === 1 ? '' : 's'} across {Object.keys(grouped).length} categories.
        </p>
        <button onClick={handleOpenNew} className="btn btn-primary btn-sm flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {/* Category breakdown */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([category, catSkills]) => (
          <div key={category} className="card p-0 overflow-hidden">
            <div className="bg-surface-secondary px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-sm text-text-primary">{category}</h3>
              <span className="text-xs text-text-tertiary">{catSkills.length} skills</span>
            </div>
            <table className="data-table">
              <tbody>
                {catSkills.map((skill) => (
                  <tr key={skill.id}>
                    <td className="w-12 font-mono text-xs text-text-tertiary">{skill.display_order}</td>
                    <td className="font-medium text-text-primary text-sm">{skill.name}</td>
                    <td className="text-xs text-text-secondary w-32">
                      {skill.proficiency ? (
                        <span className="text-primary-600 font-mono">
                          {'★'.repeat(skill.proficiency)}
                          {'☆'.repeat(5 - skill.proficiency)}
                        </span>
                      ) : (
                        <span className="text-text-tertiary">Unrated</span>
                      )}
                    </td>
                    <td className="w-28">
                      <button
                        onClick={() => handleTogglePublish(skill.id, skill.is_published)}
                        className={`badge text-xs cursor-pointer ${
                          skill.is_published ? 'status-published' : 'status-draft'
                        }`}
                      >
                        {skill.is_published ? (
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
                    <td className="w-20 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(skill)}
                        className="p-1 text-text-secondary hover:text-primary-600"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id, skill.name)}
                        className="p-1 text-text-secondary hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {isEditing && editingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-text-primary mb-4 border-b border-border pb-2">
              {editingItem.id ? 'Edit Skill' : 'Add New Skill'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <input type="hidden" name="id" value={editingItem.id || ''} />

              <div className="form-group">
                <label className="form-label">Skill Name *</label>
                <input
                  name="name"
                  required
                  className="form-input"
                  placeholder="e.g. Python, PyTorch, Docker"
                  defaultValue={editingItem.name}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  className="form-input"
                  defaultValue={editingItem.category || SKILL_CATEGORIES[0]}
                >
                  {SKILL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Proficiency (1 to 5)</label>
                  <select
                    name="proficiency"
                    className="form-input"
                    defaultValue={editingItem.proficiency?.toString() || '4'}
                  >
                    <option value="">None (Unrated)</option>
                    <option value="1">1 - Beginner</option>
                    <option value="2">2 - Elementary</option>
                    <option value="3">3 - Intermediate</option>
                    <option value="4">4 - Advanced</option>
                    <option value="5">5 - Expert</option>
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
                  {isPending ? 'Saving...' : 'Save Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
