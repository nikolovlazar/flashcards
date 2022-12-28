import useSWR from 'swr';
import type { Flashcard } from '@prisma/client';

import { getter } from './fetchers';

export function useFlashcards() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<Flashcard[]>(
    '/api/flashcards',
    getter
  );

  const create = async (
    data: Pick<Flashcard, 'question' | 'answer' | 'categoryId'>
  ) => {
    const res = await fetch('/api/flashcards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      mutate();
    }
  };

  const remove = async (slug: string) => {
    const res = await fetch(`/api/flashcards/${slug}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      mutate();
    }
  };

  const update = async (slug: string, data: Partial<Flashcard>) => {
    const res = await fetch(`/api/flashcards/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      mutate();

      return await res.json();
    }

    return null;
  };

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    create,
    remove,
    update,
  };
}

export function useFlashcard(slug: string) {
  return useSWR<Flashcard>(`/api/flashcards/${slug}`, getter);
}
