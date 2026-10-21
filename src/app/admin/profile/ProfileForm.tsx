'use client';

import { useState, useTransition } from 'react';
import type { Profile } from '@/lib/types';
import { updateProfileAction } from '@/app/admin/actions';
import { Save, CheckCircle, AlertCircle } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

export default function ProfileForm({ initialProfile }: { initialProfile: Profile }) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    formData.set('id', profile.id);

    startTransition(async () => {
      const res = await updateProfileAction(formData);
      if (res?.error) {
        setStatus({ type: 'error', message: res.error });
      } else {
        setStatus({ type: 'success', message: 'Profile updated successfully!' });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status && (
        <div
          className={`alert ${
            status.type === 'success' ? 'alert-success' : 'alert-error'
          } flex items-center gap-2`}
        >
          {status.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {/* Hero Section Info */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
          Hero & Header Information
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label" htmlFor="full_name">
              Full Name *
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              className="form-input"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="academic_status">
              Academic Status / Badge
            </label>
            <input
              id="academic_status"
              name="academic_status"
              type="text"
              className="form-input"
              placeholder="e.g. Undergraduate Student @ University"
              value={profile.academic_status}
              onChange={(e) => setProfile({ ...profile, academic_status: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="headline">
            Professional Headline
          </label>
          <input
            id="headline"
            name="headline"
            type="text"
            className="form-input"
            placeholder="e.g. Computer Science Student | Aspiring Machine Learning Researcher"
            value={profile.headline}
            onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="introduction">
            Hero Introduction Paragraph
          </label>
          <textarea
            id="introduction"
            name="introduction"
            rows={3}
            className="form-input resize-y"
            placeholder="Short engaging introduction displayed prominently on the homepage..."
            value={profile.introduction}
            onChange={(e) => setProfile({ ...profile, introduction: e.target.value })}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <ImageUploader
            label="Profile Photo"
            name="profile_image_url"
            defaultValue={profile.profile_image_url}
            placeholder="https://example.com/avatar.jpg"
            folder="avatars"
            onChange={(url) => setProfile({ ...profile, profile_image_url: url || null })}
          />

          <div className="form-group">
            <label className="form-label" htmlFor="resume_url">
              Resume / CV Link
            </label>
            <input
              id="resume_url"
              name="resume_url"
              type="url"
              className="form-input"
              placeholder="https://drive.google.com/..."
              value={profile.resume_url || ''}
              onChange={(e) => setProfile({ ...profile, resume_url: e.target.value || null })}
            />
          </div>
        </div>
      </div>

      {/* About Me Section Info */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
          About Me Details
        </h2>

        <div className="form-group">
          <label className="form-label" htmlFor="about_text">
            Personal Introduction & Overview
          </label>
          <textarea
            id="about_text"
            name="about_text"
            rows={4}
            className="form-input resize-y"
            placeholder="Detailed personal introduction describing your academic journey and aspirations..."
            value={profile.about_text}
            onChange={(e) => setProfile({ ...profile, about_text: e.target.value })}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label" htmlFor="interests">
              Academic & Professional Interests
            </label>
            <input
              id="interests"
              name="interests"
              type="text"
              className="form-input"
              placeholder="e.g. Distributed Systems, Neural NLP, Cloud Computing"
              value={profile.interests}
              onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="career_goals">
              Career Goals
            </label>
            <input
              id="career_goals"
              name="career_goals"
              type="text"
              className="form-input"
              placeholder="e.g. Seeking SWE Internships & Graduate Research Positions"
              value={profile.career_goals}
              onChange={(e) => setProfile({ ...profile, career_goals: e.target.value })}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label" htmlFor="expertise_areas">
              Areas of Expertise
            </label>
            <input
              id="expertise_areas"
              name="expertise_areas"
              type="text"
              className="form-input"
              placeholder="e.g. Full-Stack Web Development, Algorithm Design"
              value={profile.expertise_areas}
              onChange={(e) => setProfile({ ...profile, expertise_areas: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bio">
              Short Personal Bio / Hobbies
            </label>
            <input
              id="bio"
              name="bio"
              type="text"
              className="form-input"
              placeholder="e.g. Open-source enthusiast, hackathon mentor, avid reader"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Contact & Social Info */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
          Contact & Profiles
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Primary Public Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="student@example.edu"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="github_url">
              GitHub Profile URL
            </label>
            <input
              id="github_url"
              name="github_url"
              type="url"
              className="form-input"
              placeholder="https://github.com/username"
              value={profile.github_url || ''}
              onChange={(e) => setProfile({ ...profile, github_url: e.target.value || null })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="linkedin_url">
              LinkedIn Profile URL
            </label>
            <input
              id="linkedin_url"
              name="linkedin_url"
              type="url"
              className="form-input"
              placeholder="https://linkedin.com/in/username"
              value={profile.linkedin_url || ''}
              onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value || null })}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? (
            <>
              <span className="spinner" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Profile Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
