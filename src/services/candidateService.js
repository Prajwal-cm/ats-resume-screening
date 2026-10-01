import { STORAGE_KEYS, CANDIDATE_STATUS } from '../utils/constants';
import { readStore, writeStore } from './storage';
import { seedCandidates } from '../data/seed';
import { ok, delay } from './api';
import { uid } from '../utils/formatters';
import { parseResumeText } from '../utils/resumeParser';
import { scoreResume } from '../utils/atsEngine';

const getCandidates = () => readStore(STORAGE_KEYS.CANDIDATES, seedCandidates);
const saveCandidates = (list) => writeStore(STORAGE_KEYS.CANDIDATES, list);

export const candidateService = {
  async list() {
    return ok(getCandidates().sort((a, b) => b.score - a.score));
  },

  async listByJob(jobId) {
    return ok(
      getCandidates()
        .filter((c) => c.jobId === jobId)
        .sort((a, b) => b.score - a.score)
    );
  },

  async getById(id) {
    const c = getCandidates().find((x) => x.id === id);
    if (!c) throw new Error('Candidate not found');
    return ok(c);
  },

  /**
   * Parses raw resume text, runs the ATS engine, and persists the candidate.
   */
  async screenResume({ jobId, rawText, sourceName = '' }) {
    await delay(500);
    const { jobService } = await import('./jobService');
    const job = await jobService.getById(jobId);

    const parsed = parseResumeText(rawText);
    const result = scoreResume(job.requirements, parsed);

    const candidate = {
      id: uid('cand'),
      jobId,
      sourceName,
      ...parsed,
      score: result.score,
      matched: result.matched,
      missing: result.missing,
      breakdown: result.breakdown,
      status: result.score >= 70 ? CANDIDATE_STATUS.SHORTLISTED : CANDIDATE_STATUS.REVIEW,
      createdAt: new Date().toISOString(),
    };

    saveCandidates([...getCandidates(), candidate]);
    return ok(candidate);
  },

  async updateStatus(id, status) {
    await delay(200);
    const list = getCandidates().map((c) => (c.id === id ? { ...c, status } : c));
    saveCandidates(list);
    return ok(list.find((c) => c.id === id));
  },

  async remove(id) {
    await delay(200);
    saveCandidates(getCandidates().filter((c) => c.id !== id));
    return true;
  },
};