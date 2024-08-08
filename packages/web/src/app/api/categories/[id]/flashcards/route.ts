import * as helpers from "@/prisma/helpers";

// Get flashcards for category
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const categoryId = parseInt(params.id, 10);
  const category = await helpers.getCategoryById(categoryId);

  if (!category) {
    return Response.json(
      {
        error: "Category not found",
      },
      { status: 404 },
    );
  }

  const flashcards = await helpers.getFlashcardsByCategoryId(categoryId);

  return Response.json({
    category,
    flashcards,
  });
}
