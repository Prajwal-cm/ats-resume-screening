import { SKILL_LIBRARY, EDUCATION_RANK } from './constants';

const normalize = (t = '') => t.toLowerCase().replace(/\s+/g, ' ');

const detectEducation = (text) => {
  const t = normalize(text);
  if (/\b(phd|ph\.d|doctorate)\b/.test(t)) return 'PhD';
  if (/\b(master|mba|m\.?tech|m\.?sc|m\.?c\.?a)\b/.test(t)) return 'Master';
  if (/\b(bachelor|b\.?tech|b\.?e\b|b\.?sc|b\.?c\.?a|degree)\b/.test(t)) return 'Bachelor';
  return 'Any';
};

const detectExperience = (text) => {
  const t = normalize(text);
  const explicit = t.match(/(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)?/);
  if (explicit) return Math.min(Number(explicit[1]), 40);

  const range = [...t.matchAll(/(19|20)\d{2}/g)].map((m) => Number(m[0])).sort();
  if (range.length >= 2) {
    const diff = range[range.length - 1] - range[0];
    if (diff > 0 && diff < 40) return diff;
  }
  return 0;
};

const detectSkills = (text) => {
  const t = normalize(text);
  return SKILL_LIBRARY.filter((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(t);
  });
};

const detectName = (text = '') => {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  for (const line of lines.slice(0, 5)) {
    const cleaned = line.replace(/[^a-zA-Z\s.]/g, '').trim();
    const words = cleaned.split(/\s+/);
    if (words.length >= 2 && words.length <= 4 && cleaned.length <= 40) return cleaned;
  }
  return 'Unknown Candidate';
};

const detectEmail = (text = '') => (text.match(/[\w.+-]+@[\w-]+\.[\w.]+/) || [''])[0];

const detectPhone = (text = '') =>
  (text.match(/(\+?\d[\d\s-]{8,14}\d)/) || [''])[0].trim();

const detectLinks = (text = '') =>
  (text.match(/https?:\/\/[^\s)]+/g) || []).slice(0, 5);

/**
 * Parses raw resume text into a structured candidate object.
 * In production this text comes from PDF/DOCX extraction (pdfjs / mammoth).
 */
export const parseResumeText = (rawText = '') => {
  const skills = detectSkills(rawText);
  const education = detectEducation(rawText);
  const experienceYears = detectExperience(rawText);

  return {
    name: detectName(rawText),
    email: detectEmail(rawText),
    phone: detectPhone(rawText),
    links: detectLinks(rawText),
    skills,
    education,
    educationRank: EDUCATION_RANK[education] ?? 0,
    experienceYears,
    summary: rawText.trim().slice(0, 400),
    rawText,
  };
};