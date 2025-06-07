// Import markdown files as raw text
import peopleList from './people.md?raw';
import numbersList from './numbers.md?raw';
import animalsList from './animals.md?raw';
import vehiclesList from './vehicles.md?raw';
import successMessagesList from './successMessages.md?raw';

export interface DefaultList {
  name: string;
  content: string;
}

function parseMarkdownList(content: string): string[] {
  return content
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => line.trim());
}

export const defaultLists: DefaultList[] = [
  { name: 'People', content: peopleList },
  { name: 'Numbers', content: numbersList },
  { name: 'Animals', content: animalsList },
  { name: 'Vehicles', content: vehiclesList }
];

export function getDefaultListWords(listName: string): string[] {
  const list = defaultLists.find(l => l.name === listName);
  return list ? parseMarkdownList(list.content) : [];
}

export function getAllDefaultLists(): { name: string; words: string[] }[] {
  return defaultLists.map(list => ({
    name: list.name,
    words: parseMarkdownList(list.content)
  }));
}

export function getSuccessMessages(): string[] {
  return parseMarkdownList(successMessagesList);
}

export function getRandomSuccessMessage(): string {
  const messages = getSuccessMessages();
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}