import useSWR from 'swr';
import type { Category } from '@prisma/client';
import { getter } from './fetchers';

export function useCategories() {
  return useSWR<Category[]>('/api/categories', getter);
}

export function useCategory(slug: string) {
  return useSWR<Category>(`/api/categories/${slug}`, getter);
}
