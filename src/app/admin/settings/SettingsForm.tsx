'use client';

import { useState, useTransition } from 'react';
import type { SiteSettings } from '@/lib/types';
import { saveSiteSettingsAction } from '@/app/admin/actions';
import { Save, CheckCircle, AlertCircle } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

export default function SettingsForm({ initialSettings }: { initialSettings: SiteSettings }) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set('id', settings.id);

    startTransition(async () => {
      const res = await saveSiteSettingsAction(formData);
      if (res?.error) {
        setStatus({ type: 'error', message: res.error });
      } else {
        setStatus({ type: 'success', message: 'Settings saved successfully!' });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
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

      <div className="card space-y-4">
        <h2 className="text-base font-semibold text-text-primary border-b border-border pb-2">
          SEO & Meta Tags
        </h2>

        <div className="form-group">
          <label className="form-label" htmlFor="site_title">
            Website Browser Title *
          </label>
          <input
            id="site_title"
            name="site_title"
            required
            className="form-input"
            placeholder="e.g. Alex Doe | Computer Science & AI Portfolio"
            value={settings.site_title}
            onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
          />
          <p className="form-help">Displayed in browser tabs and search engine results.</p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="site_description">
            Meta Description (SEO)
          </label>
          <textarea
            id="site_description"
            name="site_description"
            rows={3}
            className="form-input resize-y"
            placeholder="Brief 150-160 character description of your portfolio and background..."
            value={settings.site_description}
            onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
          />
        </div>

        <ImageUploader
          label="Social Share Image (OpenGraph / Twitter Card)"
          name="og_image_url"
          defaultValue={settings.og_image_url}
          placeholder="https://example.com/og-banner.jpg"
          folder="og"
          onChange={(url) => setSettings({ ...settings, og_image_url: url || null })}
        />
      </div>

      <div className="card space-y-4">
        <h2 className="text-base font-semibold text-text-primary border-b border-border pb-2">
          Footer Customization
        </h2>

        <div className="form-group">
          <label className="form-label" htmlFor="footer_text">
            Footer Copyright / Subtext
          </label>
          <input
            id="footer_text"
            name="footer_text"
            className="form-input"
            placeholder="e.g. Student Portfolio. All rights reserved."
            value={settings.footer_text}
            onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? (
            <>
              <span className="spinner" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Settings
            </>
          )}
        </button>
      </div>
    </form>
  );
}
