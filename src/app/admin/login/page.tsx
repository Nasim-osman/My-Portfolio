'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Lock, ArrowLeft, AlertCircle, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    setConfigured(isSupabaseConfigured());

    // Check for query param errors (e.g. ?error=unauthorized)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('error') === 'unauthorized') {
        setError('Access denied: Your account is not authorized as an administrator.');
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    if (!isSupabaseConfigured()) {
      setError(
        'Supabase is not configured yet. Please copy .env.example to .env.local and add your Supabase credentials.'
      );
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createClient();
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (authError) {
          setError(authError.message || 'Invalid email or password.');
          return;
        }

        // Successfully signed in; redirect to admin dashboard
        router.push('/admin');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred during login.');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-secondary px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back to site link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>

        {/* Card */}
        <div className="card shadow-md p-8">
          <div className="flex items-center justify-center w-12 h-12 bg-primary-50 text-primary-600 rounded-full mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-bold text-center text-text-primary mb-2">
            Admin Portal
          </h1>
          <p className="text-sm text-center text-text-secondary mb-6">
            Sign in to manage your portfolio content, research, and projects.
          </p>

          {!configured && (
            <div className="alert alert-error flex items-start gap-2 mb-6">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
              <div className="text-xs">
                <strong>Supabase credentials not detected!</strong>
                <p className="mt-1">
                  Add <code className="bg-red-100 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
                  <code className="bg-red-100 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your{' '}
                  <code className="bg-red-100 px-1 py-0.5 rounded">.env.local</code> file to enable live authentication.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-error flex items-start gap-2 mb-6" role="alert">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm leading-tight">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <div className="form-group">
              <label htmlFor="admin-email" className="form-label">
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className="form-group">
              <label htmlFor="admin-password" className="form-label">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="spinner" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-xs text-center text-text-tertiary mt-6">
            Authorized administrator access only. Public registration is disabled.
          </p>
        </div>
      </div>
    </div>
  );
}
