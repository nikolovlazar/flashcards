import * as helpers from "@/prisma/helpers";
import { Prisma } from "@prisma/client";
import slugify from "slugify";

// Update flashcard
export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const formData = await request.formData();
  const id = parseInt(params.id, 10);

  const formValues = {
    question: formData.get("question")?.toString(),
    answer: formData.get("answer")?.toString(),
    category: formData.get("category")?.toString(),
  };

  const existingFlashcard = await helpers.getFlashcardById(id);

  if (!existingFlashcard) {
    return new Response("Flashcard not found", { status: 404 });
  }

  const updateData: Prisma.FlashcardUpdateInput = {
    question: formValues.question ?? existingFlashcard.question,
    answer: formValues.answer ?? existingFlashcard.answer,
    slug:
      (formValues.question && slugify(formValues.question, { lower: true })) ??
      existingFlashcard.slug,
  };

  if (formValues.category) {
    const categoryId = parseInt(formValues.category, 10);
    const existingCategory = await helpers.getCategoryById(categoryId);

    if (!existingCategory) {
      return new Response("Category not found", { status: 400 });
    }

    updateData.category = {
      connect: {
        id: categoryId,
      },
    };
  }

  const updatedFlashcard = await helpers.updateFlashcard(
    existingFlashcard.id,
    updateData,
  );

  return Response.json({ flashcard: updatedFlashcard }, { status: 200 });
}

// Delete flashcard
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id, 10);

  const existingFlashcard = await helpers.getFlashcardById(id);

  if (!existingFlashcard) {
    return new Response("Flashcard not found", { status: 404 });
  }

  await helpers.deleteFlashcard(existingFlashcard.slug);

  return new Response("Flashcard deleted successfully!", { status: 200 });
}
