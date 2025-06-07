import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { WordList } from '$lib/types';

interface WordGameDB extends DBSchema {
  wordLists: {
    key: string;
    value: WordList;
  };
}

const DB_NAME = 'wordgame-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<WordGameDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<WordGameDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('wordLists')) {
          db.createObjectStore('wordLists', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function getAllWordLists(): Promise<WordList[]> {
  const db = await getDB();
  return db.getAll('wordLists');
}

export async function getWordList(id: string): Promise<WordList | undefined> {
  const db = await getDB();
  return db.get('wordLists', id);
}

export async function saveWordList(wordList: WordList): Promise<void> {
  const db = await getDB();
  await db.put('wordLists', wordList);
}

export async function deleteWordList(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('wordLists', id);
}

export async function getEnabledWords(): Promise<string[]> {
  const lists = await getAllWordLists();
  const enabledLists = lists.filter(list => list.enabled);
  const allWords = enabledLists.flatMap(list => list.words);
  return [...new Set(allWords)]; // Remove duplicates
}