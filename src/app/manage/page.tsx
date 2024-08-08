import * as helpers from "@/prisma/helpers";
import { CategoriesDataTable } from "./_categories/categories-data-table";
import { FlashcardsDataTable } from "./_flashcards/flashcards-data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CreateCategory from "./_categories/create-category-dialog";
import CreateFlashcard from "./_flashcards/create-flashcard-dialog";
import { FlashcardColumn } from "./_flashcards/flashcards-columns";

export default async function Manage() {
  const flashcards = await helpers.getFlashcards();
  const categories = await helpers.getCategories();
  categories.sort((a, b) => a.id - b.id);

  const flashcardsWithCategories: FlashcardColumn[] = flashcards.map(
    (flashcard) => {
      const category = categories.find((c) => c.id === flashcard.categoryId)!;
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
