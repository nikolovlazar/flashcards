'use server';

import * as helpers from '@/prisma/helpers';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

export async function createCategory(formData: FormData) {
  const formValues = {
    name: formData.get('name')?.toString(),
  };

  if (!formValues.name) {
    return {
      error: 'Name is required',
    };
  }

  const slug = slugify(formValues.name, { lower: true });

  const existingCategory = await helpers.getCategory(slug);

  if (existingCategory) {
    return {
      error: 'Category already exists',
    };
  }

  const category = await helpers.createCategory({
    name: formValues.name,
    slug,
  });

  revalidatePath('/manage');
  return { category };
}

export async function updateCategory(formData: FormData) {
  const formValues = {
    id: formData.get('id')?.toString(),
    name: formData.get('name')?.toString(),
  };

  if (!formValues.id) {
    return {
      error: 'Category ID is missing',
    };
  }

  if (!formValues.name) {
    return {
      error: 'Name is required',
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

  revalidatePath('/manage');
  return { category };
}

export async function deleteCategory(formData: FormData) {
  const formValues = {
    id: formData.get('id')?.toString(),
  };

  if (!formValues.id) {
    return {
      error: 'Category ID is missing',
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

  revalidatePath('/manage');
  return { success: true };
}
