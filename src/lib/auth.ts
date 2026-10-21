import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { connection } from 'next/server';
import { redirect } from 'next/navigation';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Retrieves the currently authenticated Supabase user on the server.
 */
export async function getAuthUser() {
  await connection();
  if (!isSupabaseConfigured()) {
    return null;
  }
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

/**
 * Verifies if the authenticated user has administrative authorization.
 * Checks against the server-verified `admin_users` table and optional ADMIN_EMAIL env allowlist.
 */
export async function verifyAdmin(): Promise<{ authorized: boolean; user: AdminUser | null }> {
  const user = await getAuthUser();
  if (!user || !user.email) {
    return { authorized: false, user: null };
  }

  // Check optional server-side ADMIN_EMAIL env allowlist if set
  const adminEmailEnv = process.env.ADMIN_EMAIL;
  if (adminEmailEnv && user.email.toLowerCase() === adminEmailEnv.toLowerCase()) {
    try {
      const supabase = await createClient();
      await supabase
        .from('admin_users')
        .upsert({ id: user.id, email: user.email, role: 'superadmin' }, { onConflict: 'id' });
    } catch {
      // Continue even if RLS denies direct insert before manual SQL execution
    }
    return {
      authorized: true,
      user: { id: user.id, email: user.email, role: 'superadmin' },
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, role')
      .eq('id', user.id)
      .maybeSingle();

    if (error || !data) {
      // If table has not been initialized yet and user is authenticated via Supabase
      // we allow access if no other admin_users exist yet, or fail closed
      const { count } = await supabase
        .from('admin_users')
        .select('*', { count: 'exact', head: true });

      // If zero admin users exist yet in database, the first authenticated user becomes initial admin
      if (count === 0) {
        try {
          await supabase
            .from('admin_users')
            .upsert({ id: user.id, email: user.email, role: 'superadmin' }, { onConflict: 'id' });
        } catch {
          // Fallback if RLS denies insert
        }
        return {
          authorized: true,
          user: { id: user.id, email: user.email, role: 'admin' },
        };
      }

      return { authorized: false, user: null };
    }

    return {
      authorized: true,
      user: { id: data.id, email: data.email, role: data.role || 'admin' },
    };
  } catch {
    return { authorized: false, user: null };
  }
}

/**
 * Server guard: throws redirect to /admin/login if the user is not an authorized administrator.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const { authorized, user } = await verifyAdmin();
  if (!authorized || !user) {
    redirect('/admin/login?error=unauthorized');
  }
  return user;
}
