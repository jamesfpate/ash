import { writable, get } from 'svelte/store';
import { enabledWords } from './wordLists';
import type { WordWithImage } from '$lib/types';

interface WordQueueState {
  remainingWords: (string | WordWithImage)[];
  completedWords: (string | WordWithImage)[];
}

function createWordQueueStore() {
  const { subscribe, set, update } = writable<WordQueueState>({
    remainingWords: [],
    completedWords: []
  });

  // Fisher-Yates shuffle algorithm
  function shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Reset the queue when enabled words change
  enabledWords.subscribe(words => {
    if (words.length > 0) {
      set({
        remainingWords: shuffle(words),
        completedWords: []
      });
    }
  });

  return {
    subscribe,
    getNextWord(): string | WordWithImage | null {
      const state = get({ subscribe });
      
      if (state.remainingWords.length === 0) {
        // All words have been shown, reshuffle
        if (state.completedWords.length === 0) {
          return null; // No words available
        }
        
        const newRemaining = shuffle(state.completedWords);
        const nextWord = newRemaining[0];
        
        set({
          remainingWords: newRemaining.slice(1),
          completedWords: [nextWord]
        });
        
        return nextWord;
      }
      
      // Get the next word from remaining
      const nextWord = state.remainingWords[0];
      update(state => ({
        remainingWords: state.remainingWords.slice(1),
        completedWords: [...state.completedWords, nextWord]
      }));
      
      return nextWord;
    },
    reset() {
      const words = get(enabledWords);
      set({
        remainingWords: shuffle(words),
        completedWords: []
      });
    }
  };
}

export const wordQueue = createWordQueueStore();