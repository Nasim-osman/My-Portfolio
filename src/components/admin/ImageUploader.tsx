'use client';

import { useState, useRef } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Upload, Image as ImageIcon, Loader2, X, CheckCircle, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  folder?: string;
  onChange?: (url: string) => void;
}

export default function ImageUploader({
  label,
  name,
  defaultValue = '',
  placeholder = 'https://example.com/image.jpg',
  folder = 'uploads',
  onChange,
}: ImageUploaderProps) {
  const [url, setUrl] = useState(defaultValue || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    setUploadMessage(null);
    onChange?.(newUrl);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be re-selected if needed
    e.target.value = '';

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadMessage({ type: 'error', text: 'Image size must be less than 5MB.' });
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      setUploadMessage({ type: 'error', text: 'Only image files (JPEG, PNG, WebP, GIF, SVG) are allowed.' });
      return;
    }

    if (!isSupabaseConfigured()) {
      setUploadMessage({ type: 'error', text: 'Supabase storage is not configured yet. Paste an external image URL instead.' });
      return;
    }

    setIsUploading(true);
    setUploadMessage(null);

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanFileName = file.name
        .substring(0, file.name.lastIndexOf('.'))
        .replace(/[^a-zA-Z0-9]/g, '_')
        .substring(0, 20);
      const filePath = `${folder}/${Date.now()}_${cleanFileName}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw new Error(uploadError.message || 'Upload failed. Ensure the "portfolio" storage bucket exists.');
      }

      const { data: publicUrlData } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      const uploadedUrl = publicUrlData.publicUrl;
      handleUrlChange(uploadedUrl);
      setUploadMessage({ type: 'success', text: 'Uploaded to Supabase storage successfully!' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setUploadMessage({ type: 'error', text: msg });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="form-group space-y-2">
      <div className="flex items-center justify-between">
        <label className="form-label mb-0" htmlFor={name}>
          {label}
        </label>
        <span className="text-xs text-text-tertiary">Supabase Storage or External URL</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            id={name}
            name={name}
            type="url"
            className="form-input text-xs font-mono pr-8"
            placeholder={placeholder}
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
          {url && (
            <button
              type="button"
              onClick={() => handleUrlChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary p-0.5"
              title="Clear image URL"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-secondary btn-sm flex items-center gap-1.5 whitespace-nowrap"
          title="Upload image file to Supabase storage"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </>
          )}
        </button>
      </div>

      {uploadMessage && (
        <div
          className={`text-xs flex items-center gap-1.5 ${
            uploadMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {uploadMessage.type === 'success' ? (
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          )}
          <span>{uploadMessage.text}</span>
        </div>
      )}

      {/* Image Preview */}
      {url && (
        <div className="flex items-center gap-3 p-2 bg-surface-secondary border border-border rounded-lg">
          <div className="w-12 h-12 rounded-md bg-surface border border-border overflow-hidden flex items-center justify-center flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <ImageIcon className="w-5 h-5 text-text-tertiary hidden peer-only" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text-primary truncate">Active Image</p>
            <p className="text-[11px] text-text-tertiary truncate font-mono">{url}</p>
          </div>
        </div>
      )}
    </div>
  );
}
