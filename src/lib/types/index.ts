export interface WordWithImage {
  text: string;
  imageUrl?: string;
}

export interface WordList {
  id: string;
  name: string;
  words: (string | WordWithImage)[];
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}