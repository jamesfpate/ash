import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface ImageSettings {
  showTextWithImages: boolean;
}

const defaultSettings: ImageSettings = {
  showTextWithImages: true
};

function createImageSettingsStore() {
  const stored = browser ? localStorage.getItem('imageSettings') : null;
  const initial = stored ? JSON.parse(stored) : defaultSettings;
  
  const { subscribe, set, update } = writable<ImageSettings>(initial);
  
  return {
    subscribe,
    set: (value: ImageSettings) => {
      if (browser) {
        localStorage.setItem('imageSettings', JSON.stringify(value));
      }
      set(value);
    },
    update: (fn: (value: ImageSettings) => ImageSettings) => {
      update(current => {
        const newValue = fn(current);
        if (browser) {
          localStorage.setItem('imageSettings', JSON.stringify(newValue));
        }
        return newValue;
      });
    }
  };
}

export const imageSettings = createImageSettingsStore();