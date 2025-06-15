// Import YAML files as raw text
import peopleYaml from './people.yaml?raw';
import numbersYaml from './numbers.yaml?raw';
import animalsYaml from './animals.yaml?raw';
import vehiclesYaml from './vehicles.yaml?raw';
import successMessagesYaml from './successMessages.yaml?raw';
import yaml from 'js-yaml';
import type { WordWithImage } from '$lib/types';

interface YamlWordList {
  name: string;
  words: (string | { text: string; imageUrl?: string })[];
}

interface YamlSuccessMessages {
  name: string;
  messages: string[];
}

function parseYamlWordList(yamlContent: string): (string | WordWithImage)[] {
  const data = yaml.load(yamlContent) as YamlWordList;
  return data.words.map(word => {
    if (typeof word === 'string') {
      return word;
    }
    return {
      text: word.text,
      imageUrl: word.imageUrl
    } as WordWithImage;
  });
}

const peopleList = parseYamlWordList(peopleYaml);
const numbersList = parseYamlWordList(numbersYaml);
const animalsList = parseYamlWordList(animalsYaml);
const vehiclesList = parseYamlWordList(vehiclesYaml);

export function getAllDefaultLists(): { name: string; words: (string | WordWithImage)[] }[] {
  return [
    { name: 'People', words: peopleList },
    { name: 'Numbers', words: numbersList },
    { name: 'Animals', words: animalsList },
    { name: 'Vehicles', words: vehiclesList }
  ];
}

export function getSuccessMessages(): string[] {
  const data = yaml.load(successMessagesYaml) as YamlSuccessMessages;
  return data.messages;
}

export function getRandomSuccessMessage(): string {
  const messages = getSuccessMessages();
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}