export type Category = {
  ID: number;
  CreatedAt: Date;
  UpdatedAt: Date;
  DeletedAt: Date;
  name: string;
  slug: string;
};

export type Flashcard = {
  ID: number;
  CreatedAt: Date;
  UpdatedAt: Date;
  DeletedAt: Date;
  question: string;
  answer: string;
  slug: string;
  categoryId: number;
};
