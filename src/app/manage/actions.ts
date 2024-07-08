"use server";

import { z } from "zod";
import * as helpers from "@/prisma/helpers";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

const createCategorySchema = z.object({
  name: z.string().min(5),
});

export async function createCategory(formData: FormData) {
  const formValues = {
    name: formData.get("name")?.toString(),
  };

  const data = createCategorySchema.parse(formValues);

  const slug = slugify(data.name, { lower: true });

  const existingCategory = await helpers.getCategory(slug);

  if (existingCategory) {
    return {
      error: "Category already exists",
    };
  }

  const category = await helpers.createCategory({
    name: data.name,
    slug,
  });

  revalidatePath("/manage");
  return { category };
}

export async function updateCategory(formData: FormData) {
  const formValues = {
    id: formData.get("id")?.toString(),
    name: formData.get("name")?.toString(),
  };

  if (!formValues.id) {
    return {
      error: "Category ID is missing",
    };
  }

  if (!formValues.name) {
    return {
      error: "Name is required",
    };
  }

  const id = parseInt(formValues.id, 10);

  const existingCategory = await helpers.getCategoryById(id);
  if (!existingCategory) {
    return {
      error: "Category doesn't exists",
    };
  }

  const slug = slugify(formValues.name, { lower: true });

  const category = await helpers.updateCategory(id, {
    name: formValues.name,
    slug,
  });

  revalidatePath("/manage");
  return { category };
}

export async function deleteCategory(formData: FormData) {
  const formValues = {
    id: formData.get("id")?.toString(),
  };

  if (!formValues.id) {
    return {
      error: "Category ID is missing",
    };
  }

  const id = parseInt(formValues.id, 10);

  const existingCategory = await helpers.getCategoryById(id);
  if (!existingCategory) {
    return {
      error: "Category doesn't exists",
    };
  }

  await helpers.deleteCategory(existingCategory.slug);

  revalidatePath("/manage");
  return { success: true };
}

export async function createFlashcard(formData: FormData) {
  const formValues = {
    question: formData.get("question")?.toString(),
    answer: formData.get("answer")?.toString(),
    category: formData.get("category")?.toString(),
  };

  if (!formValues.question) {
    return {
      error: "Question is required",
    };
  }

  if (!formValues.answer) {
    return {
      error: "Answer is required",
    };
  }

  if (!formValues.category) {
    return {
      error: "Category is required",
    };
  }

  const categoryId = parseInt(formValues.category, 10);

  const existingCategory = await helpers.getCategoryById(categoryId);

  if (!existingCategory) {
    return {
      error: "Category not found",
    };
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

  revalidatePath("/manage");
  return { flashcard };
}

export async function updateFlashcard(formData: FormData) {
  const formValues = {
    id: formData.get("id")?.toString(),
    question: formData.get("question")?.toString(),
    answer: formData.get("answer")?.toString(),
    category: formData.get("category")?.toString(),
  };

  if (!formValues.id) {
    return {
      error: "Flashcard ID is missing",
    };
  }

  const existingFlashcard = await helpers.getFlashcardById(
    parseInt(formValues.id, 10)
  );

  if (!existingFlashcard) {
    return {
      error: "Flashcard not found",
    };
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
      return {
        error: "Category not found",
      };
    }

    updateData.category = {
      connect: {
        id: categoryId,
      },
    };
  }

  const updatedFlashcard = await helpers.updateFlashcard(
    existingFlashcard.id,
    updateData
  );

  revalidatePath("/manage");
  return { flashcard: updatedFlashcard };
}

export async function deleteFlashcard(formData: FormData) {
  const formValues = {
    id: formData.get("id")?.toString(),
  };

  if (!formValues.id) {
    return {
      error: "Flashcard ID is missing",
    };
  }

  const id = parseInt(formValues.id, 10);

  const existingFlashcard = await helpers.getFlashcardById(id);

  if (!existingFlashcard) {
    return {
      error: "Flashcard not found",
    };
  }

  await helpers.deleteFlashcard(existingFlashcard.slug);

  revalidatePath("/manage");
  return { success: true };
}
