import { requireAdmin } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase/server';
import { connection } from 'next/server';
import {
  getAdminProjects,
  getAdminSkills,
  getAdminEducation,
  getAdminResearch,
  getAdminExperience,
  getAdminAchievements,
  getAdminContactMessages,
} from '@/lib/data';
import Link from 'next/link';
import {
  FolderOpen,
  Wrench,
  GraduationCap,
  BookOpen,
  Briefcase,
  Award,
  Mail,
  ArrowRight,
  Database,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export const instant = false;

export default async function AdminDashboardOverview() {
  await connection();
  await requireAdmin();
  const configured = isSupabaseConfigured();

  const [
    projects,
    skills,
    education,
    research,
    experience,
    achievements,
    messages,
  ] = await Promise.all([
    getAdminProjects(),
    getAdminSkills(),
    getAdminEducation(),
    getAdminResearch(),
    getAdminExperience(),
    getAdminAchievements(),
    getAdminContactMessages(),
  ]);

  const stats = [
    { label: 'Total Projects', count: projects.length, href: '/admin/projects', icon: FolderOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Skills', count: skills.length, href: '/admin/skills', icon: Wrench, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Education Records', count: education.length, href: '/admin/education', icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Research Entries', count: research.length, href: '/admin/research', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Experience Entries', count: experience.length, href: '/admin/experience', icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Achievements', count: achievements.length, href: '/admin/achievements', icon: Award, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const unreadMessages = messages.filter((m: { is_read?: boolean }) => !m.is_read);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Dashboard Overview</h1>
        <p className="text-sm text-text-secondary mt-1">
          Welcome back. Manage and update your portfolio content, research, and incoming messages.
        </p>
      </div>

      {/* Supabase status indicator */}
      <div className={`p-4 rounded-xl border flex items-center justify-between ${
        configured
          ? 'bg-green-50/50 border-green-200 text-green-800'
          : 'bg-amber-50/50 border-amber-200 text-amber-800'
      }`}>
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-semibold">
              {configured ? 'Database Connected' : 'Database Pending Setup'}
            </span>
            <p className="text-xs opacity-90 mt-0.5">
              {configured
                ? 'Connected to your Supabase project. Changes will persist directly to your database.'
                : 'Using local placeholder data. Add your Supabase credentials to .env.local to persist live changes.'}
            </p>
          </div>
        </div>
        {configured ? (
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 hidden sm:block" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 hidden sm:block" />
        )}
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="card hover:border-primary-300 transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-medium text-text-secondary">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl md:text-3xl font-bold text-text-primary">
                  {stat.count}
                </span>
                <span className="text-xs text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Manage <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick shortcuts & Recent messages */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Management Links */}
        <div className="card">
          <h2 className="text-base font-semibold text-text-primary mb-4">Quick Management</h2>
          <div className="divide-y divide-border">
            <Link
              href="/admin/profile"
              className="py-3 flex items-center justify-between text-sm text-text-secondary hover:text-primary-600 transition-colors"
            >
              <span>Edit Profile & Hero Introduction</span>
              <ArrowRight className="w-4 h-4 text-text-tertiary" />
            </Link>
            <Link
              href="/admin/projects"
              className="py-3 flex items-center justify-between text-sm text-text-secondary hover:text-primary-600 transition-colors"
            >
              <span>Add / Reorder Projects</span>
              <ArrowRight className="w-4 h-4 text-text-tertiary" />
            </Link>
            <Link
              href="/admin/research"
              className="py-3 flex items-center justify-between text-sm text-text-secondary hover:text-primary-600 transition-colors"
            >
              <span>Manage Research & Publications</span>
              <ArrowRight className="w-4 h-4 text-text-tertiary" />
            </Link>
            <Link
              href="/admin/settings"
              className="py-3 flex items-center justify-between text-sm text-text-secondary hover:text-primary-600 transition-colors"
            >
              <span>Configure Site Settings & SEO</span>
              <ArrowRight className="w-4 h-4 text-text-tertiary" />
            </Link>
          </div>
        </div>

        {/* Incoming Contact Messages */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary-600" />
              Incoming Messages
            </h2>
            {unreadMessages.length > 0 && (
              <span className="badge text-xs bg-red-50 text-red-700 border-red-200">
                {unreadMessages.length} unread
              </span>
            )}
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-8 text-text-tertiary text-sm">
              No contact messages received yet.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {messages.slice(0, 3).map((msg: { id: string; name: string; email: string; message: string; created_at: string; is_read?: boolean }) => (
                <div key={msg.id} className="py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-text-primary">{msg.name}</span>
                    <span suppressHydrationWarning className="text-xs text-text-tertiary">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary truncate">{msg.message}</p>
                </div>
              ))}
              <div className="pt-3">
                <Link
                  href="/admin/messages"
                  className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  View all messages ({messages.length}) <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
