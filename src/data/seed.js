import { ROLES, CANDIDATE_STATUS, INTERVIEW_STATUS } from '../utils/constants';

export const seedUsers = [
  {
    id: 'usr_admin',
    name: 'System Admin',
    email: 'admin@ats.com',
    password: 'admin123',
    role: ROLES.ADMIN,
    createdAt: new Date('2024-01-05').toISOString(),
  },
  {
    id: 'usr_hr',
    name: 'Priya Sharma',
    email: 'hr@ats.com',
    password: 'hr12345',
    role: ROLES.HR,
    createdAt: new Date('2024-02-10').toISOString(),
  },
];

export const seedJobs = [
  {
    id: 'job_frontend',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    employmentType: 'Full-time',
    description: `We are looking for a Senior Frontend Engineer with 5+ years of experience.
Required skills: React, JavaScript, TypeScript, Redux, HTML, CSS, Git.
Experience with Next.js, Jest and CI/CD is a plus.
Bachelor degree in Computer Science or equivalent experience required.
You will build scalable UI components and collaborate in an Agile team.`,
    requirements: {
      skills: ['javascript', 'react', 'typescript', 'redux', 'html', 'css', 'git', 'next.js', 'jest', 'ci/cd'],
      minExperience: 5,
      education: 'Bachelor',
      keywords: ['frontend', 'react', 'typescript', 'engineer', 'agile'],
    },
    status: 'Open',
    createdBy: 'usr_hr',
    createdAt: new Date('2024-03-01').toISOString(),
  },
];

export const seedCandidates = [
  {
    id: 'cand_1',
    jobId: 'job_frontend',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@example.com',
    phone: '+91 98765 43210',
    links: ['https://github.com/arjunmehta'],
    skills: ['react', 'javascript', 'typescript', 'redux', 'html', 'css', 'git', 'next.js', 'jest'],
    education: 'Bachelor',
    experienceYears: 6,
    summary: 'Frontend engineer with 6 years building React applications at scale.',
    rawText: '',
    score: 97,
    matched: ['javascript', 'react', 'typescript', 'redux', 'html', 'css', 'git', 'next.js', 'jest'],
    missing: ['ci/cd'],
    breakdown: { skills: 54, experience: 25, education: 15 },
    status: CANDIDATE_STATUS.NEW,
    createdAt: new Date('2024-03-04').toISOString(),
  },
  {
    id: 'cand_2',
    jobId: 'job_frontend',
    name: 'Sara Khan',
    email: 'sara.khan@example.com',
    phone: '+91 91234 56780',
    links: [],
    skills: ['javascript', 'html', 'css', 'react'],
    education: 'Bachelor',
    experienceYears: 2,
    summary: 'Junior frontend developer focused on React and modern CSS.',
    rawText: '',
    score: 46,
    matched: ['javascript', 'react', 'html', 'css'],
    missing: ['typescript', 'redux', 'git', 'next.js', 'jest', 'ci/cd'],
    breakdown: { skills: 24, experience: 10, education: 15 },
    status: CANDIDATE_STATUS.REVIEW,
    createdAt: new Date('2024-03-05').toISOString(),
  },
];

export const seedInterviews = [];