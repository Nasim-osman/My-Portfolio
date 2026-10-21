'use client';

import { useState, useTransition } from 'react';
import type { Project } from '@/lib/types';
import {
  saveProjectAction,
  deleteProjectAction,
  toggleProjectFeaturedAction,
  toggleProjectPublishAction,
} from '@/app/admin/actions';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Eye, EyeOff, Star, ExternalLink } from 'lucide-react';
import { Github } from '@/components/common/Icons';
import ImageUploader from '@/components/admin/ImageUploader';

export default function ProjectsManager({ initialProjects }: { initialProjects: Project[] }) {
  const [items, setItems] = useState<Project[]>(initialProjects);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Project> | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenNew = () => {
    setEditingItem({
      title: '',
      short_description: '',
      detailed_description: '',
      technologies: [],
      image_url: '',
      github_url: '',
      live_url: '',
      category: 'Web Application',
      start_date: '',
      completion_date: '',
      is_featured: false,
      display_order: items.length + 1,
      is_published: true,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (item: Project) => {
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
      const res = await saveProjectAction(formData);
      if (res?.error) {
        setStatus({ type: 'error', message: res.error });
      } else {
        setStatus({ type: 'success', message: 'Project saved successfully!' });
        handleClose();
        window.location.reload();
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete project "${name}"?`)) return;
    setStatus(null);

    startTransition(async () => {
      const res = await deleteProjectAction(id);
      if (res?.error) {
        setStatus({ type: 'error', message: res.error });
      } else {
        setItems(items.filter((i) => i.id !== id));
        setStatus({ type: 'success', message: 'Project deleted.' });
      }
    });
  };

  const handleToggleFeatured = (id: string, current: boolean) => {
    startTransition(async () => {
      const res = await toggleProjectFeaturedAction(id, current);
      if (res?.error) {
        setStatus({ type: 'error', message: res.error });
      } else {
        setItems(items.map((i) => (i.id === id ? { ...i, is_featured: !current } : i)));
      }
    });
  };

  const handleTogglePublish = (id: string, current: boolean) => {
    startTransition(async () => {
      const res = await toggleProjectPublishAction(id, current);
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
          Displaying {items.length} project{items.length === 1 ? '' : 's'}.
        </p>
        <button onClick={handleOpenNew} className="btn btn-primary btn-sm flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Project Title</th>
              <th>Category</th>
              <th>Tech Stack</th>
              <th>Featured</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-text-tertiary">
                  No projects added yet. Click &quot;Add Project&quot; to showcase your work.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="w-12 font-mono text-xs text-text-tertiary">{item.display_order}</td>
                  <td>
                    <div className="font-semibold text-text-primary text-sm">{item.title}</div>
                    <div className="text-xs text-text-secondary truncate max-w-xs">
                      {item.short_description}
                    </div>
                  </td>
                  <td className="text-xs text-text-secondary">{item.category}</td>
                  <td>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {item.technologies?.slice(0, 3).map((t) => (
                        <span key={t} className="px-1.5 py-0.5 text-[10px] bg-surface-secondary text-text-secondary rounded">
                          {t}
                        </span>
                      ))}
                      {item.technologies?.length > 3 && (
                        <span className="text-[10px] text-text-tertiary">+{item.technologies.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleFeatured(item.id, item.is_featured)}
                      className={`p-1.5 rounded transition-colors ${
                        item.is_featured
                          ? 'text-amber-500 hover:text-amber-600 bg-amber-50'
                          : 'text-text-tertiary hover:text-text-secondary'
                      }`}
                      title={item.is_featured ? 'Featured on homepage' : 'Not featured'}
                    >
                      <Star className={`w-4 h-4 ${item.is_featured ? 'fill-amber-500' : ''}`} />
                    </button>
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
                    {item.github_url && (
                      <a
                        href={item.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block p-1 text-text-tertiary hover:text-text-primary"
                        title="GitHub Repo"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {item.live_url && (
                      <a
                        href={item.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block p-1 text-text-tertiary hover:text-primary-600"
                        title="Live Demo"
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
              {editingItem.id ? 'Edit Project' : 'Add New Project'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <input type="hidden" name="id" value={editingItem.id || ''} />

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="form-group sm:col-span-2">
                  <label className="form-label">Project Title *</label>
                  <input
                    name="title"
                    required
                    className="form-input"
                    placeholder="e.g. Distributed Task Queue"
                    defaultValue={editingItem.title}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    name="category"
                    className="form-input"
                    placeholder="e.g. Full-Stack / AI"
                    defaultValue={editingItem.category || 'General'}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Short Description (for cards) *</label>
                <textarea
                  name="short_description"
                  required
                  rows={2}
                  className="form-input resize-y"
                  placeholder="One or two sentences summarizing the project..."
                  defaultValue={editingItem.short_description}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Description (Optional)</label>
                <textarea
                  name="detailed_description"
                  rows={4}
                  className="form-input resize-y"
                  placeholder="In-depth details on architecture, problem solved, algorithms used, and results..."
                  defaultValue={editingItem.detailed_description || ''}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Technologies Used (comma separated)</label>
                <input
                  name="technologies"
                  className="form-input"
                  placeholder="Next.js, TypeScript, PostgreSQL, Tailwind CSS"
                  defaultValue={editingItem.technologies?.join(', ') || ''}
                />
              </div>

              <ImageUploader
                label="Project Thumbnail / Screenshot"
                name="image_url"
                defaultValue={editingItem.image_url}
                placeholder="https://example.com/preview.png"
                folder="projects"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">GitHub URL</label>
                  <input
                    name="github_url"
                    type="url"
                    className="form-input"
                    placeholder="https://github.com/..."
                    defaultValue={editingItem.github_url || ''}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Live Demo URL</label>
                  <input
                    name="live_url"
                    type="url"
                    className="form-input"
                    placeholder="https://myproject.com"
                    defaultValue={editingItem.live_url || ''}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    className="form-input"
                    defaultValue={editingItem.start_date || ''}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Completion Date</label>
                  <input
                    type="date"
                    name="completion_date"
                    className="form-input"
                    defaultValue={editingItem.completion_date || ''}
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
                    name="is_featured"
                    defaultChecked={editingItem.is_featured}
                  />
                  Mark as Featured Project
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
                  {isPending ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
