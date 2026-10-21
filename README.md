# Lightweight, Dynamic Student Portfolio Website

A complete, production-ready, lightweight personal portfolio website for university students. Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase** for database, authentication, and storage. Designed for fast loading, clean typography, responsive layouts, accessibility, and zero-maintenance content updates via an integrated **Admin Dashboard**.

---

## Features

- **Public Portfolio**:
  - Sticky / standard navigation header with smooth scroll.
  - Hero Section (Name, professional headline, introduction, profile photo, academic status, CTAs, resume link).
  - About Me (Detailed bio, academic & career goals, expertise, personal interests).
  - Education (Timeline of degrees, departments, CGPA, coursework, achievements).
  - Categorized Skills (Programming, AI/ML, Research & Data, Tools, Communication with proficiency stars).
  - Projects Showcase (Featured & regular projects, technology tags, live demo & GitHub repository links).
  - Research & Publications (Paper abstracts, publication status badges: in progress, submitted, published, completed).
  - Experience (Internships, student teaching assistantships, volunteer work, leadership activities with formatted dates).
  - Achievements & Certifications (Awards, honors, credentials).
  - Contact Section (Public contact details & validated anti-spam contact form).
  - Subtle Admin Lock Icon in header for private access.
- **Admin Dashboard (`/admin`)**:
  - Secure email/password authentication using Supabase Auth.
  - Server-verified administrator authorization (Row Level Security & allowlist table).
  - Overview statistics (total projects, skills, research, experience, contact messages).
  - Dedicated management pages for all sections.
  - Full CRUD operations (Add, Edit, Delete with confirmation dialogs).
  - Publish / Draft toggle (unpublished content is hidden from visitors).
  - Instant cache revalidation (`revalidatePath`) — no redeployment needed for updates.
  - Contact form inbox with read/unread tracking and reply links.
- **Performance & SEO**:
  - Built with React Server Components (RSC) for minimal client JavaScript.
  - Automatic OpenGraph metadata and search engine tags.
  - Accessible semantic HTML with skip-to-content links and keyboard focus rings.
  - Fallback student placeholders so the site works immediately out of the box even before database connection.

---

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend & Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Deployment**: Vercel

---

## Getting Started Locally

### 1. Install Dependencies

Clone this repository and install packages:

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In your Supabase project dashboard, navigate to the **SQL Editor** tab on the left sidebar.
3. Open the file [`supabase/schema.sql`](supabase/schema.sql) in this repository, copy its full content, paste it into the Supabase SQL Editor, and click **Run**.
   - This creates all required tables (`profiles`, `education`, `skills`, `projects`, `research`, `experience`, `achievements`, `social_links`, `site_settings`, `contact_messages`, `admin_users`).
   - It enables Row Level Security (RLS) policies allowing public read access for published items and restricting edits to authorized admins.
   - It creates the `portfolio` storage bucket for uploaded media.
   - It inserts initial template records.

### 3. Create the Initial Administrator

1. In your Supabase dashboard, go to **Authentication > Users** and click **Add User > Create User**.
2. Enter your desired administrator email (e.g. `your.email@university.edu`) and a strong password. Click **Create User**.
3. Copy the newly created user's **User UID** (a UUID string like `d3b07384d113...`).
4. Go back to the **SQL Editor** and run the following query to grant admin privileges:

```sql
INSERT INTO public.admin_users (id, email, role)
VALUES ('PASTE_USER_UID_HERE', 'your.email@university.edu', 'superadmin');
```

*(Note: The server-side authorization check will also automatically grant initial admin access if the `admin_users` table has no entries yet, or if you configure the optional `ADMIN_EMAIL` environment variable).*

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Open `.env.local` and add your Supabase credentials:

```env
# In Supabase: Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# Optional: Server-side email allowlist for the administrator
ADMIN_EMAIL=your.email@university.edu

# Optional: Instant Email Forwarding for Contact Form (Resend - https://resend.com)
RESEND_API_KEY=re_your_api_key_here
CONTACT_NOTIFICATION_EMAIL=your.email@university.edu
```

### 5. Email Forwarding for Contact Messages (Optional, Free)

By default, all messages sent through your portfolio contact form are safely stored in your Supabase database and accessible in the **Admin Dashboard > Messages** (`/admin/messages`).

If you'd like to also receive an immediate email notification directly in your inbox:
1. Sign up for a free account at [resend.com](https://resend.com) (free tier includes 3,000 emails/month).
2. Go to **API Keys** and click **Create API Key**.
3. Copy the key (starts with `re_...`) and paste it into `.env.local` as `RESEND_API_KEY`.
4. Now, whenever a visitor sends a message, you will receive an email alert with their details and a 1-click **Reply** button.

### 6. Run the Local Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- Public portfolio: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login` (or click the lock icon in the top right header)
- Admin dashboard: `http://localhost:3000/admin`

---

## Deploying to Vercel

1. Push your repository to your GitHub account:
   ```bash
   git add .
   git commit -m "Initial commit of student portfolio"
   git push origin main
   ```

2. Visit [vercel.com](https://vercel.com) and log in.
3. Click **Add New... > Project** and import your portfolio repository.
4. In the **Environment Variables** section before deploying, add:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key
   - `ADMIN_EMAIL` (optional): Your admin email address
5. Click **Deploy**. Vercel will build and launch your production site.

---

## Maintaining Your Content

Once deployed, you never need to edit code to update your portfolio:

1. Visit `/admin/login` on your deployed domain.
2. Log in with your admin credentials.
3. Use the sidebar to update:
   - **Profile & Bio**: Change your name, bio, hero introduction, academic status, resume link, and profile image.
   - **Education**: Add degrees, colleges, GPA, and coursework.
   - **Skills**: Add new technologies, organize them into categories, and rate your proficiency.
   - **Projects**: Showcase new projects with GitHub links, live demos, and toggle "Featured" status.
   - **Research**: Track papers from "In Progress" to "Submitted" to "Published" with arXiv/document links.
   - **Experience**: Add new internships, teaching assistant roles, and leadership positions.
   - **Achievements**: Add certifications, hackathon awards, and scholarships.
   - **Social Links**: Link your GitHub, LinkedIn, Google Scholar, and personal blog.
   - **Messages**: View messages submitted by visitors through your contact form.
4. Any changes saved in the dashboard are instantly updated on the public website via Next.js cache revalidation.

---

## Troubleshooting

- **Admin Login fails with "Invalid email or password"**:
  - Verify that the user exists in your Supabase dashboard under **Authentication > Users** and that you typed the password correctly.
- **Admin Login redirects with "Access denied"**:
  - Ensure the user's UID was added to the `public.admin_users` table in Supabase, or set `ADMIN_EMAIL` in `.env.local` to match your login email.
- **Changes not showing up immediately**:
  - The application automatically calls `revalidatePath('/')` on all save actions. A simple page refresh will display the newest data.
- **Build Errors on Vercel**:
  - Ensure both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are provided in the Vercel project settings.
