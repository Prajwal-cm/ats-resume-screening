import { STORAGE_KEYS, INTERVIEW_STATUS, CANDIDATE_STATUS } from '../utils/constants';
import { readStore, writeStore } from './storage';
import { seedInterviews } from '../data/seed';
import { ok, delay } from './api';
import { uid } from '../utils/formatters';

const getInterviews = () => readStore(STORAGE_KEYS.INTERVIEWS, seedInterviews);
const saveInterviews = (list) => writeStore(STORAGE_KEYS.INTERVIEWS, list);

export const interviewService = {
  async list() {
    return ok(getInterviews().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  },

  async getByToken(token) {
    const interview = getInterviews().find((i) => i.token === token);
    if (!interview) throw new Error('Interview request not found');
    return ok(interview);
  },

  async sendRequest({ candidate, job, date, time, mode, message }) {
    await delay();
    const interview = {
      id: uid('int'),
      token: uid('tok'),
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      jobId: job.id,
      jobTitle: job.title,
      date,
      time,
      mode,
      message,
      status: INTERVIEW_STATUS.PENDING,
      createdAt: new Date().toISOString(),
    };
    saveInterviews([...getInterviews(), interview]);

    const { candidateService } = await import('./candidateService');
    await candidateService.updateStatus(candidate.id, CANDIDATE_STATUS.INTERVIEW);

    return ok(interview);
  },

  async respond(token, status) {
    await delay();
    const list = getInterviews().map((i) =>
      i.token === token ? { ...i, status, respondedAt: new Date().toISOString() } : i
    );
    saveInterviews(list);
    return ok(list.find((i) => i.token === token));
  },
};