import { Prisma } from '@prisma/client';
import prisma from '.';

export const getFlashcards = async () => {
  return await prisma.flashcard.findMany();
};

export const getFlashcard = async (slug: string) => {
  return await prisma.flashcard.findFirst({
    where: {
      slug,
    },
  });
};

export const getFlashcardById = async (id: number) => {
  return await prisma.flashcard.findFirst({
    where: {
      id,
    },
  });
};

export const createFlashcard = async (data: Prisma.FlashcardCreateInput) => {
  return await prisma.flashcard.create({
    data,
  });
};

export const updateFlashcard = async (
  id: number,
  data: Prisma.FlashcardUpdateInput
) => {
  return await prisma.flashcard.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteFlashcard = async (slug: string) => {
  const flashcard = await getFlashcard(slug);
  if (flashcard) {
    return await prisma.flashcard.delete({
      where: {
        id: flashcard.id,
      },
    });
  }
};

export const getCategories = async () => {
  return await prisma.category.findMany();
};

export const getCategoryById = async (id: number) => {
  return await prisma.category.findUnique({
    where: {
      id,
    },
  });
};

export const getCategory = async (slug: string) => {
  return await prisma.category.findFirst({
    where: {
      slug,
    },
    include: {
      flashcards: true,
    },
  });
};

export const createCategory = async (data: Prisma.CategoryCreateInput) => {
  return await prisma.category.create({
    data,
  });
};

export const updateCategory = async (
  id: number,
  data: Prisma.CategoryUpdateInput
) => {
  return await prisma.category.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteCategory = async (slug: string) => {
  const category = await getCategory(slug);
  if (category) {
    return await prisma.category.delete({
      where: {
        id: category.id,
      },
    });
  }
};
