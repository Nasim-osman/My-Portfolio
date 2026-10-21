import { NextResponse } from 'next/server';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json({ error: 'Message must be at least 5 characters long' }, { status: 400 });
    }

    if (name.length > 100 || email.length > 255 || message.length > 5000) {
      return NextResponse.json({ error: 'Input exceeds maximum allowed length' }, { status: 400 });
    }

    // 1. Store message in Supabase database
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { error } = await supabase.from('contact_messages').insert({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });

      if (error) {
        console.error('Database error storing contact message:', error.message);
        return NextResponse.json(
          { error: 'Unable to save your message right now. Please try again or reach out via email.' },
          { status: 500 }
        );
      }
    } else {
      console.log('Contact form submission (database not connected yet):', {
        name: name.trim(),
        email: email.trim(),
        messageLength: message.length,
      });
    }

    // 2. Dispatch email notification to owner if Resend is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const toEmail = process.env.CONTACT_NOTIFICATION_EMAIL || 'nasim0001@std.uftb.ac.bd';

        await resend.emails.send({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: [toEmail],
          replyTo: email.trim(),
          subject: `New Portfolio Message from ${name.trim()}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <h2 style="color: #0f172a; margin-top: 0; border-bottom: 2px solid #4f46e5; padding-bottom: 12px;">New Contact Message</h2>
              <p style="color: #475569; font-size: 14px;">You received a new message from your portfolio website:</p>
              
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 80px;">From:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: bold;">${escapeHtml(name.trim())}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email.trim())}" style="color: #4f46e5; text-decoration: none;">${escapeHtml(email.trim())}</a></td>
                </tr>
              </table>
              
              <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 16px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; color: #1e293b; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message.trim())}</p>
              </div>
              
              <p style="color: #94a3b8; font-size: 12px; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                Tip: You can click <strong>Reply</strong> in your email client to respond directly to ${escapeHtml(name.trim())}.
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('Failed to send email notification via Resend:', emailErr);
      }
    } else {
      console.log('RESEND_API_KEY is not set in .env.local; message was saved to database only.');
    }

    return NextResponse.json(
      { success: true, message: 'Message received successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
