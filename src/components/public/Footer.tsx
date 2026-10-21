'use client';

import { Heart, ArrowUp } from 'lucide-react';
import type { Profile, SocialLink } from '@/lib/types';

interface FooterProps {
  profile: Profile | null;
  socialLinks: SocialLink[];
}

export default function Footer({ profile, socialLinks }: FooterProps) {
  const currentYear = 2026;
  const name = profile?.full_name || 'Nasim Osman';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border/80 bg-surface-secondary/70 backdrop-blur-xs transition-colors" role="contentinfo">
      <div className="container-main py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-secondary" suppressHydrationWarning>
            © {currentYear} {name}. All rights reserved.
          </p>

          {socialLinks.length > 0 && (
            <div className="flex items-center gap-5">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
                  aria-label={`Visit ${link.platform}`}
                >
                  {link.platform}
                </a>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            <p className="text-xs text-text-tertiary flex items-center gap-1.5">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> & Next.js
            </p>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-1.5 rounded-lg border border-border/80 hover:bg-surface text-text-secondary hover:text-primary-600 dark:hover:text-primary-400 transition-all"
              title="Back to Top"
              aria-label="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
