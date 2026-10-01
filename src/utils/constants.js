export const ROLES = {
  ADMIN: 'admin',
  HR: 'hr',
};

export const STORAGE_KEYS = {
  USERS: 'ats_users',
  JOBS: 'ats_jobs',
  CANDIDATES: 'ats_candidates',
  INTERVIEWS: 'ats_interviews',
  SESSION: 'ats_session',
  SEEDED: 'ats_seeded_v1',
};

export const CANDIDATE_STATUS = {
  NEW: 'New',
  SHORTLISTED: 'Shortlisted',
  REVIEW: 'Review',
  REJECTED: 'Rejected',
  INTERVIEW: 'Interview',
  SELECTED: 'Selected',
};

export const INTERVIEW_STATUS = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  DECLINED: 'Declined',
};

export const SCORE_THRESHOLD = 70;

export const SKILL_LIBRARY = [
  'javascript', 'typescript', 'react', 'redux', 'next.js', 'vue', 'angular',
  'node.js', 'express', 'nestjs', 'python', 'django', 'flask', 'fastapi',
  'java', 'spring', 'spring boot', 'kotlin', 'swift', 'go', 'rust', 'php',
  'laravel', 'ruby', 'rails', 'c#', '.net', 'sql', 'mysql', 'postgresql',
  'mongodb', 'redis', 'graphql', 'rest', 'docker', 'kubernetes', 'aws',
  'azure', 'gcp', 'terraform', 'jenkins', 'git', 'ci/cd', 'html', 'css',
  'sass', 'tailwind', 'bootstrap', 'jest', 'cypress', 'playwright', 'figma',
  'machine learning', 'nlp', 'pandas', 'numpy', 'tensorflow', 'pytorch',
  'agile', 'scrum', 'jira', 'microservices', 'kafka', 'rabbitmq', 'linux',
];

export const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'you', 'are', 'our', 'will', 'that', 'this',
  'have', 'has', 'from', 'not', 'but', 'all', 'can', 'any', 'who', 'their',
  'them', 'they', 'was', 'were', 'been', 'being', 'into', 'over', 'also',
  'about', 'would', 'should', 'could', 'work', 'role', 'team', 'job', 'must',
  'plus', 'etc', 'using', 'use', 'well', 'good', 'strong', 'ability', 'year',
  'years', 'experience', 'candidate', 'responsibilities', 'requirements',
]);

export const EDUCATION_RANK = {
  Any: 0,
  Bachelor: 1,
  Master: 2,
  PhD: 3,
};