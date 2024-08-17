import { CategoriesDataTable } from "./_categories/categories-data-table";
import { FlashcardsDataTable } from "./_flashcards/flashcards-data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CreateCategory from "./_categories/create-category-dialog";
import CreateFlashcard from "./_flashcards/create-flashcard-dialog";
import { FlashcardColumn } from "./_flashcards/flashcards-columns";
import { Category, Flashcard } from "@/lib/models";

const getData = async () => {
  const categoriesRes = await fetch("http://api:3001/categories");
  if (!categoriesRes.ok) {
    const error = await categoriesRes.text();
    throw new Error(error);
  }
  const categories = (await categoriesRes.json()) as Category[];

  const flashcardsRes = await fetch("http://api:3001/flashcards");
  if (!flashcardsRes.ok) {
    const error = await flashcardsRes.text();
    throw new Error(error);
  }
  const flashcards = (await flashcardsRes.json()) as Flashcard[];

  return { categories, flashcards };
};

export default async function Manage() {
  const { categories, flashcards } = await getData();

  categories.sort((a, b) => a.ID - b.ID);

  const flashcardsWithCategories: FlashcardColumn[] = flashcards.map(
    (flashcard) => {
      const category = categories.find((c) => c.ID === flashcard.categoryId)!;
      return {
        ...flashcard,
        category,
      };
    },
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <span className="font-bold text-3xl">Categories</span>
          <CreateCategory />
        </CardHeader>
        <CardContent>
          <CategoriesDataTable categories={categories} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <span className="font-bold text-3xl">Flashcards</span>
          <CreateFlashcard categories={categories} />
        </CardHeader>
        <CardContent>
          <FlashcardsDataTable
            flashcards={flashcardsWithCategories}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
}
