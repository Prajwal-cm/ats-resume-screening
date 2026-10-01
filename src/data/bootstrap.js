import { STORAGE_KEYS } from '../utils/constants';
import { readStore, writeStore } from '../services/storage';
import { seedUsers, seedJobs, seedCandidates, seedInterviews } from './seed';

/** Seeds localStorage once so the demo has data on first run. */
export const seedIfEmpty = () => {
  if (readStore(STORAGE_KEYS.SEEDED)) return;

  if (!readStore(STORAGE_KEYS.USERS)) writeStore(STORAGE_KEYS.USERS, seedUsers);
  if (!readStore(STORAGE_KEYS.JOBS)) writeStore(STORAGE_KEYS.JOBS, seedJobs);
  if (!readStore(STORAGE_KEYS.CANDIDATES)) writeStore(STORAGE_KEYS.CANDIDATES, seedCandidates);
  if (!readStore(STORAGE_KEYS.INTERVIEWS)) writeStore(STORAGE_KEYS.INTERVIEWS, seedInterviews);

  writeStore(STORAGE_KEYS.SEEDED, true);
};