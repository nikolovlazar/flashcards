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
