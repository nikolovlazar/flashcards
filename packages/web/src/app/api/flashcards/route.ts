import * as helpers from "@/prisma/helpers";
import slugify from "slugify";

export async function PUT(request: Request) {
  const formData = await request.formData();

  const formValues = {
    question: formData.get("question")?.toString(),
    answer: formData.get("answer")?.toString(),
    category: formData.get("category")?.toString(),
  };

  if (!formValues.question) {
    return new Response("Question is required", { status: 400 });
  }

  if (!formValues.answer) {
    return new Response("Answer is required", { status: 400 });
  }

  if (!formValues.category) {
    return new Response("Category is required", { status: 400 });
  }

  const categoryId = parseInt(formValues.category, 10);

  const existingCategory = await helpers.getCategoryById(categoryId);

  if (!existingCategory) {
    return new Response("Category not found", { status: 404 });
  }

  const slug = slugify(formValues.question, { lower: true });

  const flashcard = await helpers.createFlashcard({
    question: formValues.question,
    answer: formValues.answer,
    category: {
      connect: {
        id: categoryId,
      },
    },
    slug,
  });

  return Response.json({ flashcard }, { status: 201 });
}
