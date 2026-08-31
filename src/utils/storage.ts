import { UserData, emptyUserData } from '../types';

const STORAGE_KEY = 'admission-app-userdata-v1';

export function loadUserData(): UserData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(emptyUserData);
    const parsed = JSON.parse(raw);
    // merge with defaults so new fields added later don't break old saves
    return { ...structuredClone(emptyUserData), ...parsed };
  } catch {
    return structuredClone(emptyUserData);
  }
}

export function saveUserData(data: UserData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save user data', e);
  }
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string): number {
  const d1 = new Date(a).getTime();
  const d2 = new Date(b).getTime();
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}
