import { writable, derived } from 'svelte/store';
import type { WordList, WordWithImage } from '$lib/types';
import { getAllWordLists, saveWordList, deleteWordList as deleteFromDB } from '$lib/storage/db';
import { getAllDefaultLists } from '$lib/defaultLists';

function createWordListsStore() {
  const { subscribe, set, update } = writable<WordList[]>([]);

  return {
    subscribe,
    async load() {
      const lists = await getAllWordLists();
      
      // If no lists exist, initialize with default lists
      if (lists.length === 0) {
        const defaultLists = getAllDefaultLists();
        for (const defaultList of defaultLists) {
          const newList: WordList = {
            id: crypto.randomUUID(),
            name: defaultList.name,
            words: defaultList.words,
            enabled: defaultList.name === 'People',
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
          await saveWordList(newList);
          lists.push(newList);
        }
      }
      
      set(lists);
    },
    async add(name: string, words: (string | WordWithImage)[]) {
      const newList: WordList = {
        id: crypto.randomUUID(),
        name,
        words,
        enabled: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      await saveWordList(newList);
      update(lists => [...lists, newList]);
    },
    async update(id: string, updates: Partial<WordList>) {
      const lists = await getAllWordLists();
      const list = lists.find(l => l.id === id);
      if (list) {
        const updatedList = { ...list, ...updates, updatedAt: Date.now() };
        await saveWordList(updatedList);
        update(lists => lists.map(l => l.id === id ? updatedList : l));
      }
    },
    async delete(id: string) {
      await deleteFromDB(id);
      update(lists => lists.filter(l => l.id !== id));
    },
    async toggleEnabled(id: string) {
      const lists = await getAllWordLists();
      const list = lists.find(l => l.id === id);
      if (list) {
        const updatedList = { ...list, enabled: !list.enabled, updatedAt: Date.now() };
        await saveWordList(updatedList);
        update(lists => lists.map(l => l.id === id ? updatedList : l));
      }
    }
  };
}

export const wordLists = createWordListsStore();

export const enabledWords = derived(wordLists, ($wordLists) => {
  const enabledLists = $wordLists.filter(list => list.enabled);
  const allWords = enabledLists.flatMap(list => list.words);
  
  // Remove duplicates based on the text content
  const uniqueWords = new Map<string, string | WordWithImage>();
  allWords.forEach(word => {
    const text = typeof word === 'string' ? word : word.text;
    if (!uniqueWords.has(text)) {
      uniqueWords.set(text, word);
    }
  });
  
  return Array.from(uniqueWords.values());
});