const STATIC_TIMESTAMP = '2026-01-01T00:00:00.000Z';

import type {
  Profile,
  Education,
  Skill,
  Project,
  Research,
  Experience,
  Achievement,
  SocialLink,
  SiteSettings,
} from './types';

export const PLACEHOLDER_PROFILE: Profile = {
  id: 'placeholder-profile-id',
  full_name: '[Your Name]',
  headline: '[Computer Science & Engineering Student | Aspiring Software Engineer]',
  introduction:
    'Passionate university student specializing in full-stack development, modern web systems, and applied machine learning. Dedicated to writing clean, maintainable code and contributing to open-source and research projects.',
  profile_image_url: null,
  academic_status: '[Undergraduate Student at University Name]',
  about_text:
    'I am a motivated computer science undergraduate focused on building scalable, accessible, and user-centric software solutions. My academic background has provided me with a strong foundation in algorithms, systems design, and database engineering.',
  interests: 'Distributed Systems, Cloud Architecture, Artificial Intelligence, Web Performance, Open Source Software',
  career_goals:
    'Seeking software engineering internships and collaborative research opportunities where I can apply my skills to solve real-world problems and grow as an engineer.',
  expertise_areas: 'Full-Stack Web Development, REST APIs, Database Design, Data Structures & Algorithms',
  bio:
    'When not coding or studying, I enjoy participating in technical hackathons, exploring new developer tools, reading research publications, and mentoring peers in introductory programming courses.',
  email: 'student@example.edu',
  github_url: 'https://github.com',
  linkedin_url: 'https://linkedin.com',
  resume_url: null,
  created_at: STATIC_TIMESTAMP,
  updated_at: STATIC_TIMESTAMP,
};

export const PLACEHOLDER_EDUCATION: Education[] = [
  {
    id: 'placeholder-edu-1',
    institution: '[University Name]',
    degree: 'Bachelor of Science in Computer Science & Engineering',
    department: 'Department of Computer Science',
    start_year: 2022,
    end_year: 2026,
    is_current: true,
    cgpa: '[3.85 / 4.00]',
    description:
      'Relevant coursework includes Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Computer Networks, Operating Systems, and Software Engineering.',
    achievements: "Dean's Honor List (Multiple Semesters), Academic Merit Scholarship Recipient",
    display_order: 1,
    is_published: true,
    created_at: STATIC_TIMESTAMP,
    updated_at: STATIC_TIMESTAMP,
  },
  {
    id: 'placeholder-edu-2',
    institution: '[Higher Secondary College / High School]',
    degree: 'Higher Secondary Certificate (Science)',
    department: 'Science & Mathematics',
    start_year: 2020,
    end_year: 2022,
    is_current: false,
    cgpa: '[GPA 5.00 / 5.00]',
    description: 'Focused on Advanced Mathematics, Physics, Chemistry, and Information & Communication Technology.',
    achievements: 'Graduated with Highest Distinction in Mathematics',
    display_order: 2,
    is_published: true,
    created_at: STATIC_TIMESTAMP,
    updated_at: STATIC_TIMESTAMP,
  },
];

export const PLACEHOLDER_SKILLS: Skill[] = [
  // Programming & Development
  { id: 'skill-1', name: 'TypeScript', category: 'Programming & Development', proficiency: 5, display_order: 1, is_published: true, created_at: '', updated_at: '' },
  { id: 'skill-2', name: 'JavaScript (ES6+)', category: 'Programming & Development', proficiency: 5, display_order: 2, is_published: true, created_at: '', updated_at: '' },
  { id: 'skill-3', name: 'Python', category: 'Programming & Development', proficiency: 4, display_order: 3, is_published: true, created_at: '', updated_at: '' },
  { id: 'skill-4', name: 'C / C++', category: 'Programming & Development', proficiency: 4, display_order: 4, is_published: true, created_at: '', updated_at: '' },
  { id: 'skill-5', name: 'SQL / PostgreSQL', category: 'Programming & Development', proficiency: 4, display_order: 5, is_published: true, created_at: '', updated_at: '' },
  { id: 'skill-6', name: 'HTML5 & CSS3', category: 'Programming & Development', proficiency: 5, display_order: 6, is_published: true, created_at: '', updated_at: '' },

  // AI & Machine Learning
  { id: 'skill-7', name: 'PyTorch', category: 'AI & Machine Learning', proficiency: 3, display_order: 1, is_published: true, created_at: '', updated_at: '' },
  { id: 'skill-8', name: 'Scikit-Learn', category: 'AI & Machine Learning', proficiency: 4, display_order: 2, is_published: true, created_at: '', updated_at: '' },
  { id: 'skill-9', name: 'NumPy & Pandas', category: 'AI & Machine Learning', proficiency: 4, display_order: 3, is_published: true, created_at: '', updated_at: '' },
  { id: 'skill-10', name: 'Computer Vision Basics', category: 'AI & Machine Learning', proficiency: 3, display_order: 4, is_published: true, created_at: '', updated_at: '' },

  // Research & Data Analysis
  { id: 'skill-11', name: 'Experimental Design', category: 'Research & Data Analysis', proficiency: 4, display_order: 1, is_published: true, created_at: '', updated_at: '' },
  { id: 'skill-12', name: 'Scientific Writing (LaTeX)', category: 'Research & Data Analysis', proficiency: 4, display_order: 2, is_published: true, created_at: '', updated_at: '' },
  { id: 'skill-13', name: 'Statistical Data Analysis', category: 'Research & Data Analysis', proficiency: 3, display_order: 3, is_published: true, created_at: '', updated_at: '' },

  // Tools & Technologies
  { id: 'skill-14', name: 'Next.js & React', category: 'Tools & Technologies', proficiency: 5, display_order: 1, is_published: true, created_at: '', updated_at: '' },
  { id: 'skill-15', name: 'Git & GitHub', category: 'Tools & Technologies', proficiency: 5, display_order: 2, is_published: true, created_at: '', updated_at: '' },
  { id: 'skill-16', name: 'Tailwind CSS', category: 'Tools & Technologies', proficiency: 5, display_order: 3, is_published: true, created_at: '', updated_at: '' },
  { id: 'skill-17', name: 'Supabase', category: 'Tools & Technologies', proficiency: 4, display_order: 4, is_published: true, created_at: '', updated_at: '' },
  { id: 'skill-18', name: 'Docker & Linux', category: 'Tools & Technologies', proficiency: 3, display_order: 5, is_published: true, created_at: '', updated_at: '' },

  // Communication & Other
  { id: 'skill-19', name: 'Technical Presentation', category: 'Communication & Other', proficiency: 4, display_order: 1, is_published: true, created_at: '', updated_at: '' },
  { id: 'skill-20', name: 'Peer Mentoring & Tutoring', category: 'Communication & Other', proficiency: 5, display_order: 2, is_published: true, created_at: '', updated_at: '' },
  { id: 'skill-21', name: 'Agile & Team Collaboration', category: 'Communication & Other', proficiency: 4, display_order: 3, is_published: true, created_at: '', updated_at: '' },
];

export const PLACEHOLDER_PROJECTS: Project[] = [
  {
    id: 'placeholder-proj-1',
    title: '[Project 1: Research Paper Summarizer & Semantic Search]',
    short_description: 'An AI-powered academic tool providing automated abstract summarization and cross-document semantic search using vector embeddings.',
    detailed_description: 'Developed an end-to-end web platform for university students and researchers to upload PDF papers, generate concise bulleted summaries, and query paper archives via semantic embeddings. Integrated responsive UI with fast client-side rendering.',
    technologies: ['Next.js', 'TypeScript', 'Python', 'Tailwind CSS', 'Vector DB'],
    image_url: null,
    github_url: 'https://github.com',
    live_url: 'https://demo.example.com',
    category: 'AI & Web Application',
    start_date: '2024-01-15',
    completion_date: '2024-04-30',
    is_featured: true,
    display_order: 1,
    is_published: true,
    created_at: STATIC_TIMESTAMP,
    updated_at: STATIC_TIMESTAMP,
  },
  {
    id: 'placeholder-proj-2',
    title: '[Project 2: Campus Event & Course Collaboration Portal]',
    short_description: 'A real-time student platform for university club activities, study groups, and peer review of academic courses.',
    detailed_description: 'Architected with a relational database model, row-level security, and role-based access control. Implemented event scheduling, RSVP management, and student feedback boards.',
    technologies: ['React', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'TypeScript'],
    image_url: null,
    github_url: 'https://github.com',
    live_url: 'https://demo.example.com',
    category: 'Full-Stack Web App',
    start_date: '2023-09-01',
    completion_date: '2023-12-10',
    is_featured: true,
    display_order: 2,
    is_published: true,
    created_at: STATIC_TIMESTAMP,
    updated_at: STATIC_TIMESTAMP,
  },
  {
    id: 'placeholder-proj-3',
    title: '[Project 3: High-Performance Distributed Task Queue]',
    short_description: 'A lightweight distributed background worker engine with exponential backoff retry logic and telemetry dashboard.',
    detailed_description: 'Implemented in Node.js and Redis. Supports priority scheduling, worker health heartbeats, dead-letter queues, and real-time job throughput monitoring.',
    technologies: ['Node.js', 'Redis', 'TypeScript', 'Docker'],
    image_url: null,
    github_url: 'https://github.com',
    live_url: null,
    category: 'Systems & Backend',
    start_date: '2023-06-01',
    completion_date: '2023-08-15',
    is_featured: false,
    display_order: 3,
    is_published: true,
    created_at: STATIC_TIMESTAMP,
    updated_at: STATIC_TIMESTAMP,
  },
];

export const PLACEHOLDER_RESEARCH: Research[] = [
  {
    id: 'placeholder-res-1',
    title: '[Research: Efficient Embedding Quantization for Edge RAG Pipelines]',
    description: 'Investigating techniques to compress high-dimensional vector embeddings for low-latency neural information retrieval on resource-constrained devices.',
    research_area: 'Natural Language Processing & Systems',
    status: 'in_progress',
    authors: '[Your Name], [Advisor Name]',
    date: '2024 - Present',
    paper_url: null,
    relevant_links: null,
    display_order: 1,
    is_published: true,
    created_at: STATIC_TIMESTAMP,
    updated_at: STATIC_TIMESTAMP,
  },
  {
    id: 'placeholder-res-2',
    title: '[Study on Student Learning Outcomes in Hybrid Computer Science Curricula]',
    description: 'An empirical investigation analyzing student performance and engagement metrics between remote and in-person laboratory programming coursework.',
    research_area: 'Computer Science Education',
    status: 'completed',
    authors: '[Your Name], [Co-Author Name]',
    date: '2023',
    paper_url: 'https://example.com/paper.pdf',
    relevant_links: null,
    display_order: 2,
    is_published: true,
    created_at: STATIC_TIMESTAMP,
    updated_at: STATIC_TIMESTAMP,
  },
];

export const PLACEHOLDER_EXPERIENCE: Experience[] = [
  {
    id: 'placeholder-exp-1',
    position: 'Undergraduate Teaching Assistant',
    organization: '[University Department of Computer Science]',
    type: 'University Activity',
    start_date: '2023-08-01',
    end_date: null,
    is_current: true,
    description: 'Assisting course instructors with teaching laboratory sessions and mentoring students in introductory data structures.',
    responsibilities: '• Conduct weekly lab sessions and office hours for 60+ undergraduate students.\n• Grade programming assignments and guide students in debugging C++ and Python code.\n• Assist in drafting examination problems and automated test suites.',
    display_order: 1,
    is_published: true,
    created_at: STATIC_TIMESTAMP,
    updated_at: STATIC_TIMESTAMP,
  },
  {
    id: 'placeholder-exp-2',
    position: 'Software Engineering Intern',
    organization: '[Tech Company or Research Lab Name]',
    type: 'Internship',
    start_date: '2024-06-01',
    end_date: '2024-08-31',
    is_current: false,
    description: 'Developed internal web tools, optimized database query bottlenecks, and contributed to frontend feature rollouts.',
    responsibilities: '• Built reusable React components and integrated RESTful endpoints with TypeScript.\n• Reduced average database query latency by 35% through indexing and query refactoring.\n• Collaborated in weekly Agile sprints, code reviews, and cross-functional design discussions.',
    display_order: 2,
    is_published: true,
    created_at: STATIC_TIMESTAMP,
    updated_at: STATIC_TIMESTAMP,
  },
];

export const PLACEHOLDER_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'placeholder-ach-1',
    title: "Dean's Honor List",
    organization: '[University Name]',
    date: '2023 - 2024',
    description: 'Awarded for maintaining a semester GPA within the top 5% of the engineering faculty.',
    credential_url: null,
    display_order: 1,
    is_published: true,
    created_at: STATIC_TIMESTAMP,
    updated_at: STATIC_TIMESTAMP,
  },
  {
    id: 'placeholder-ach-2',
    title: 'Champion / First Place - Annual University Hackathon',
    organization: '[University Computer Club]',
    date: 'Spring 2024',
    description: 'Designed and built an accessibility-focused study tool in a 36-hour sprint with a team of four.',
    credential_url: 'https://example.com/certificate',
    display_order: 2,
    is_published: true,
    created_at: STATIC_TIMESTAMP,
    updated_at: STATIC_TIMESTAMP,
  },
];

export const PLACEHOLDER_SOCIAL_LINKS: SocialLink[] = [
  { id: 'social-1', platform: 'GitHub', url: 'https://github.com', icon_name: 'github', display_order: 1, is_published: true, created_at: '', updated_at: '' },
  { id: 'social-2', platform: 'LinkedIn', url: 'https://linkedin.com', icon_name: 'linkedin', display_order: 2, is_published: true, created_at: '', updated_at: '' },
];

export const PLACEHOLDER_SETTINGS: SiteSettings = {
  id: 'placeholder-settings-id',
  site_title: '[Student Name] | Personal Portfolio',
  site_description: 'Academic background, skills, projects, research, and experience of [Student Name].',
  footer_text: 'Student Portfolio. All rights reserved.',
  og_image_url: null,
  favicon_url: null,
  created_at: STATIC_TIMESTAMP,
  updated_at: STATIC_TIMESTAMP,
};
