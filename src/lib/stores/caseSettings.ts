import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type CaseMode = 'default' | 'uppercase' | 'lowercase';

const STORAGE_KEY = 'wordgame-case-mode';

function createCaseSettingsStore() {
  // Load from localStorage if available
  const stored = browser ? localStorage.getItem(STORAGE_KEY) : null;
  const initialValue: CaseMode = (stored as CaseMode) || 'uppercase';
  
  const { subscribe, set, update } = writable<CaseMode>(initialValue);

  return {
    subscribe,
    set: (value: CaseMode) => {
      if (browser) {
        localStorage.setItem(STORAGE_KEY, value);
      }
      set(value);
    }
  };
}

export const caseMode = createCaseSettingsStore();

export function applyCase(text: string, mode: CaseMode): string {
  switch (mode) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'default':
    default:
      return text;
  }
}