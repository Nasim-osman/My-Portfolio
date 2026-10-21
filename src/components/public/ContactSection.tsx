'use client';

import { useState } from 'react';
import type { Profile, SocialLink } from '@/lib/types';
import { Mail, Send, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { Github, Linkedin } from '@/components/common/Icons';

interface ContactSectionProps {
  profile: Profile | null;
  socialLinks: SocialLink[];
}

export default function ContactSection({ profile, socialLinks }: ContactSectionProps) {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('submitting');
    setErrorMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    // Basic client-side validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please fill in all required fields.');
      setFormState('error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      setFormState('error');
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send message');
      }

      setFormState('success');
      form.reset();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
      setFormState('error');
    }
  };

  return (
    <section id="contact" className="section relative" aria-labelledby="contact-heading">
      <div className="container-main">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/60 border border-primary-200/60 dark:border-primary-800/60">
            <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Get In Touch
            </span>
            <h2 id="contact-heading" className="text-3xl font-extrabold text-text-primary tracking-tight">
              Contact
            </h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 max-w-5xl">
          {/* Contact info column */}
          <div className="lg:col-span-2 space-y-6">
            <p className="text-base text-text-secondary leading-relaxed">
              Have a research inquiry, collaboration opportunity, or question? Feel free to reach out directly through the form or my social channels.
            </p>

            <div className="space-y-3">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="card flex items-center gap-3.5 p-4 hover:border-primary-500/50 hover:shadow-md transition-all group"
                >
                  <div className="p-2.5 rounded-lg bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                      Direct Email
                    </p>
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {profile.email}
                    </p>
                  </div>
                </a>
              )}

              {socialLinks.map((link) => {
                const IconComponent = getIcon(link.platform);
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card flex items-center gap-3.5 p-4 hover:border-primary-500/50 hover:shadow-md transition-all group"
                  >
                    <div className="p-2.5 rounded-lg bg-surface-secondary text-text-secondary group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:scale-105 transition-all">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                        {link.platform}
                      </p>
                      <p className="text-sm font-semibold text-text-primary truncate">
                        {link.url.replace(/^https?:\/\/(www\.)?/, '')}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Contact form card */}
          <div className="lg:col-span-3">
            <div className="card shadow-lg p-6 sm:p-8 border-border/80 dark:border-border/60">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-4 h-4 text-primary-500" />
                <h3 className="text-base font-bold text-text-primary">Send a Direct Message</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {formState === 'success' && (
                  <div className="alert alert-success flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Message sent successfully! I&apos;ll get back to you soon.</span>
                  </div>
                )}
                {formState === 'error' && errorMessage && (
                  <div className="alert alert-error flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="form-group mb-0">
                    <label htmlFor="contact-name" className="form-label">Name *</label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      required
                      className="form-input"
                      placeholder="Your name"
                      disabled={formState === 'submitting'}
                    />
                  </div>

                  <div className="form-group mb-0">
                    <label htmlFor="contact-email" className="form-label">Email *</label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      required
                      className="form-input"
                      placeholder="your.email@example.com"
                      disabled={formState === 'submitting'}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message" className="form-label">Message *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    className="form-input resize-y"
                    placeholder="Tell me about your project, idea, or questions..."
                    disabled={formState === 'submitting'}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full text-base py-3 font-semibold shadow-md hover:shadow-indigo-500/25 transition-all"
                  disabled={formState === 'submitting'}
                >
                  {formState === 'submitting' ? (
                    <>
                      <span className="spinner" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function getIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case 'github': return Github;
    case 'linkedin': return Linkedin;
    case 'email': return Mail;
    default: return Mail;
  }
}
