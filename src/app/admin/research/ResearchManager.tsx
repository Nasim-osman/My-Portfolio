'use client';

import { useState, useTransition } from 'react';
import type { Research } from '@/lib/types';
import { RESEARCH_STATUS_LABELS } from '@/lib/types';
import {
  saveResearchAction,
  deleteResearchAction,
  toggleResearchPublishAction,
} from '@/app/admin/actions';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Eye, EyeOff, ExternalLink } from 'lucide-react';

export default function ResearchManager({ initialResearch }: { initialResearch: Research[] }) {
  const [items, setItems] = useState<Research[]>(initialResearch);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Research> | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenNew = () => {
    setEditingItem({
      title: '',
      description: '',
      research_area: '',
      status: 'in_progress',
      authors: '',
      date: new Date().getFullYear().toString(),
      paper_url: '',
      relevant_links: '',
      display_order: items.length + 1,
      is_published: true,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (item: Research) => {
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
      const res = await saveResearchAction(formData);
      if (res?.error) {
        setStatus({ type: 'error', message: res.error });
      } else {
        setStatus({ type: 'success', message: 'Research record saved successfully!' });
        handleClose();
        window.location.reload();
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete research record "${name}"?`)) return;
    setStatus(null);

    startTransition(async () => {
      const res = await deleteResearchAction(id);
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
      const res = await toggleResearchPublishAction(id, current);
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
          Displaying {items.length} research publication{items.length === 1 ? '' : 's'}.
        </p>
        <button onClick={handleOpenNew} className="btn btn-primary btn-sm flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Research
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Title & Area</th>
              <th>Status</th>
              <th>Authors</th>
              <th>Visibility</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-text-tertiary">
                  No research entries found. Click &quot;Add Research&quot; to add your publications.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="w-12 font-mono text-xs text-text-tertiary">{item.display_order}</td>
                  <td>
                    <div className="font-semibold text-text-primary text-sm">{item.title}</div>
                    <div className="text-xs text-primary-600 font-medium">{item.research_area}</div>
                  </td>
                  <td>
                    <span className="badge text-xs">
                      {RESEARCH_STATUS_LABELS[item.status] || item.status}
                    </span>
                  </td>
                  <td className="text-xs text-text-secondary max-w-[150px] truncate">{item.authors}</td>
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
                    {item.paper_url && (
                      <a
                        href={item.paper_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block p-1 text-text-tertiary hover:text-primary-600"
                        title="View Paper"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1 text-text-secondary hover:text-primary-600"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
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
              {editingItem.id ? 'Edit Research Entry' : 'Add Research / Publication'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <input type="hidden" name="id" value={editingItem.id || ''} />

              <div className="form-group">
                <label className="form-label">Research / Paper Title *</label>
                <input
                  name="title"
                  required
                  className="form-input"
                  placeholder="e.g. Efficient Embedding Quantization for Edge RAG Pipelines"
                  defaultValue={editingItem.title}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Research Area / Subfield</label>
                  <input
                    name="research_area"
                    className="form-input"
                    placeholder="e.g. Natural Language Processing, Machine Learning"
                    defaultValue={editingItem.research_area}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Publication Status</label>
                  <select
                    name="status"
                    className="form-input"
                    defaultValue={editingItem.status || 'in_progress'}
                  >
                    <option value="in_progress">In Progress</option>
                    <option value="submitted">Submitted</option>
                    <option value="published">Published</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Abstract / Description *</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  className="form-input resize-y"
                  placeholder="Summary of methodology, hypothesis, and experimental findings..."
                  defaultValue={editingItem.description}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Authors List</label>
                  <input
                    name="authors"
                    className="form-input"
                    placeholder="e.g. Jane Doe, John Smith (Advisor)"
                    defaultValue={editingItem.authors}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date / Year</label>
                  <input
                    name="date"
                    className="form-input"
                    placeholder="e.g. 2024, Fall 2023"
                    defaultValue={editingItem.date || ''}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Paper / Preprint / PDF URL</label>
                  <input
                    name="paper_url"
                    type="url"
                    className="form-input"
                    placeholder="https://arxiv.org/abs/..."
                    defaultValue={editingItem.paper_url || ''}
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
                  {isPending ? 'Saving...' : 'Save Research'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
