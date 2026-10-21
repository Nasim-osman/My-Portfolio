import { NextResponse } from 'next/server';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

export async function POST(request: Request) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  const requestUrl = new URL(request.url);
  return NextResponse.redirect(`${requestUrl.origin}/admin/login`, {
    status: 303,
  });
}
