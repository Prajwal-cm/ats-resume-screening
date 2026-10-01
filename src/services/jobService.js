import { STORAGE_KEYS } from '../utils/constants';
import { readStore, writeStore } from './storage';
import { seedJobs } from '../data/seed';
import { ok, delay } from './api';
import { uid } from '../utils/formatters';
import { extractRequirements } from '../utils/atsEngine';

const getJobs = () => readStore(STORAGE_KEYS.JOBS, seedJobs);
const saveJobs = (jobs) => writeStore(STORAGE_KEYS.JOBS, jobs);

export const jobService = {
  async list() {
    return ok(getJobs().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  },

  async getById(id) {
    const job = getJobs().find((j) => j.id === id);
    if (!job) throw new Error('Job not found');
    return ok(job);
  },

  async create(payload, userId) {
    await delay();
    const job = {
      ...payload,
      id: uid('job'),
      requirements: extractRequirements(payload.description),
      status: 'Open',
      createdBy: userId,
      createdAt: new Date().toISOString(),
    };
    saveJobs([...getJobs(), job]);
    return ok(job);
  },

  async update(id, payload) {
    await delay();
    const jobs = getJobs().map((j) =>
      j.id === id
        ? { ...j, ...payload, requirements: extractRequirements(payload.description), updatedAt: new Date().toISOString() }
        : j
    );
    saveJobs(jobs);
    return ok(jobs.find((j) => j.id === id));
  },

  async remove(id) {
    await delay(200);
    saveJobs(getJobs().filter((j) => j.id !== id));
    return true;
  },

  async toggleStatus(id) {
    await delay(200);
    const jobs = getJobs().map((j) =>
      j.id === id ? { ...j, status: j.status === 'Open' ? 'Closed' : 'Open' } : j
    );
    saveJobs(jobs);
    return ok(jobs.find((j) => j.id === id));
  },
};