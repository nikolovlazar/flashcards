export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type Flashcard = {
  id: number;
  question: string;
  answer: string;
  slug: string;
  category_id: number;
};
