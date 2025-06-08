import { writable } from 'svelte/store';

export type KeyboardSettings = {
	restrictToCorrectLetter: boolean;
};

const STORAGE_KEY = 'keyboard-settings';

function createKeyboardSettingsStore() {
	const defaultSettings: KeyboardSettings = {
		restrictToCorrectLetter: true
	};

	const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
	const initial = stored ? JSON.parse(stored) : defaultSettings;

	const { subscribe, set, update } = writable<KeyboardSettings>(initial);

	return {
		subscribe,
		set: (value: KeyboardSettings) => {
			if (typeof window !== 'undefined') {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
			}
			set(value);
		},
		update: (fn: (value: KeyboardSettings) => KeyboardSettings) => {
			update((value) => {
				const newValue = fn(value);
				if (typeof window !== 'undefined') {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
				}
				return newValue;
			});
		},
		reset: () => {
			if (typeof window !== 'undefined') {
				localStorage.removeItem(STORAGE_KEY);
			}
			set(defaultSettings);
		}
	};
}

export const keyboardSettings = createKeyboardSettingsStore();