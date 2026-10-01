import { STORAGE_KEYS, ROLES } from '../utils/constants';
import { readStore, writeStore, removeStore } from './storage';
import { seedUsers } from '../data/seed';
import { ok, delay, clone } from './api';
import { uid } from '../utils/formatters';

const getUsers = () => readStore(STORAGE_KEYS.USERS, seedUsers);
const saveUsers = (users) => writeStore(STORAGE_KEYS.USERS, users);

export const authService = {
  async login({ email, password }) {
    await delay();
    const user = getUsers().find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!user) throw new Error('Invalid email or password');
    const session = { id: user.id, name: user.name, email: user.email, role: user.role };
    writeStore(STORAGE_KEYS.SESSION, session);
    return clone(session);
  },

  logout() {
    removeStore(STORAGE_KEYS.SESSION);
  },

  getSession() {
    return readStore(STORAGE_KEYS.SESSION, null);
  },

  async listHRUsers() {
    return ok(getUsers().filter((u) => u.role === ROLES.HR));
  },

  async createHRAccount({ name, email, password }) {
    await delay();
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      throw new Error('An account with this email already exists');
    }
    const newUser = {
      id: uid('usr'),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: ROLES.HR,
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    return clone(newUser);
  },

  async deleteHRUser(id) {
    await delay(200);
    saveUsers(getUsers().filter((u) => u.id !== id));
    return true;
  },
};