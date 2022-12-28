import useSWR from 'swr';
import type { Category, Flashcard } from '@prisma/client';
import { getter } from './fetchers';

export function useCategories() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<Category[]>(
    '/api/categories',
    getter
  );

  const create = async (name: string) => {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
      }),
    });

    if (res.ok) {
      mutate();
    }
  };

  const remove = async (slug: string) => {
    const res = await fetch(`/api/categories/${slug}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      mutate();
    }
  };

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    create,
    remove,
  };
}

export function useCategory(slug: string) {
  return useSWR<Category & { flashcards?: Flashcard[] }>(
    `/api/categories/${slug}`,
    getter
  );
}
