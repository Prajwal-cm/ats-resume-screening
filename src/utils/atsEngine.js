import { STOP_WORDS, SKILL_LIBRARY, EDUCATION_RANK } from './constants';

const normalize = (t = '') => t.toLowerCase().replace(/[^a-z0-9+#./\s-]/g, ' ');

const tokenize = (text = '') =>
  normalize(text).split(/\s+/).filter((t) => t.length > 2 && !STOP_WORDS.has(t));

/**
 * Extracts structured requirements from a job description.
 */
export const extractRequirements = (jobDescription = '') => {
  const text = normalize(jobDescription);

  const skills = SKILL_LIBRARY.filter((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(text);
  });

  const expMatch = text.match(/(\d+)\s*\+?\s*(?:years?|yrs?)/);
  const minExperience = expMatch ? Number(expMatch[1]) : 0;

  const education = /\b(phd|doctorate)\b/.test(text)
    ? 'PhD'
    : /\b(master|mba|m\.?tech|m\.?sc)\b/.test(text)
    ? 'Master'
    : /\b(bachelor|b\.?tech|b\.?e|b\.?sc|degree)\b/.test(text)
    ? 'Bachelor'
    : 'Any';

  const keywords = [...new Set(tokenize(jobDescription))].slice(0, 30);

  return { skills, minExperience, education, keywords };
};

/**
 * Weighted ATS scoring:
 *   Skills     -> 60 pts
 *   Experience -> 25 pts
 *   Education  -> 15 pts
 */
export const scoreResume = (requirements, resume) => {
  const requiredSkills = requirements.skills || [];
  const resumeSkills = (resume.skills || []).map((s) => s.toLowerCase());

  const matched = requiredSkills.filter((s) => resumeSkills.includes(s));
  const missing = requiredSkills.filter((s) => !resumeSkills.includes(s));

  const skillScore = requiredSkills.length
    ? (matched.length / requiredSkills.length) * 60
    : 60;

  const expScore = requirements.minExperience
    ? Math.min((resume.experienceYears || 0) / requirements.minExperience, 1) * 25
    : 25;

  const requiredRank = EDUCATION_RANK[requirements.education] ?? 0;
  const resumeRank = EDUCATION_RANK[resume.education] ?? 0;
  const eduScore = resumeRank >= requiredRank ? 15 : Math.max(0, 15 - (requiredRank - resumeRank) * 7);

  const total = Math.round(skillScore + expScore + eduScore);

  return {
    score: Math.max(0, Math.min(100, total)),
    matched,
    missing,
    breakdown: {
      skills: Math.round(skillScore),
      experience: Math.round(expScore),
      education: Math.round(eduScore),
    },
  };
};

export const scoreLabel = (score) => {
  if (score >= 85) return { label: 'Excellent Match', tone: 'success' };
  if (score >= 70) return { label: 'High Match', tone: 'success' };
  if (score >= 50) return { label: 'Moderate Match', tone: 'warning' };
  return { label: 'Low Match', tone: 'danger' };
};