'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Lock } from 'lucide-react';
import ThemeToggle from '@/components/common/ThemeToggle';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#education', label: 'Education' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#research', label: 'Research' },
  { href: '#experience', label: 'Experience' },
  { href: '#achievements', label: 'Achievements' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140; // offset for sticky navbar
      const sectionIds = navLinks.map((link) => link.href.slice(1));

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(`#${sectionIds[i]}`);
            return;
          }
        }
      }
      setActiveSection('#home');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setActiveSection(href);
    setIsMenuOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-border/80 bg-surface/90 backdrop-blur-md transition-colors"
      role="banner"
    >
      <nav className="container-main flex items-center justify-between h-16" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="Portfolio Home">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-xs transition-colors group-hover:bg-indigo-700">
            N
          </span>
          <span className="font-bold text-base tracking-tight text-text-primary group-hover:text-primary-600 transition-colors">
            Portfolio
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-surface-secondary text-text-tertiary border border-border">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Available
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`px-3 py-1.5 text-sm rounded-md transition-all duration-150 ${
                  isActive
                    ? 'font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 shadow-xs'
                    : 'font-medium text-text-secondary hover:text-text-primary hover:bg-surface-secondary/80'
                }`}
              >
                {link.label}
              </a>
            );
          })}

          <div className="flex items-center gap-2 ml-3 pl-3 border-l border-border/80">
            <ThemeToggle />
            <Link
              href="/admin/login"
              className="p-2 text-text-tertiary hover:text-text-primary hover:bg-surface-secondary rounded-lg transition-colors"
              title="Admin Login"
              aria-label="Admin Login"
            >
              <Lock className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 text-text-secondary hover:text-text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div id="mobile-menu" className="lg:hidden border-t border-border bg-surface pb-4">
          <div className="container-main flex flex-col gap-1 pt-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2.5 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                  }`}
                  onClick={() => handleNavClick(link.href)}
                >
                  {link.label}
                </a>
              );
            })}
            <div className="flex items-center justify-between px-3 pt-3 mt-2 border-t border-border">
              <Link
                href="/admin/login"
                className="flex items-center gap-2 text-sm text-text-tertiary hover:text-text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <Lock className="w-4 h-4" />
                Admin
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
