import useSWR, { mutate } from 'swr';

import type { Flashcard } from '@prisma/client';

export function useFlashcards() {
  const { data: flashcards } = useSWR<Flashcard[]>(
    '/api/flashcards',
    async () => {
      const res = await fetch('/api/flashcards', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        return await res.json();
      } else {
        throw new Error(
          `Failed to fetch flashcards. Reason: ${res.statusText}`
        );
      }
    }
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
      mutate('/api/flashcards');
      return await res.json();
    } else {
      throw new Error(`Failed to create flashcard. Reason: ${res.statusText}`);
    }
  };

  return {
    flashcards,
    create,
  };
}

export function useFlashcard(slug?: string) {
  const { data: flashcard } = useSWR<Flashcard>(
    slug && `/api/flashcards/${slug}`,
    async () => {
      const res = await fetch(`/api/flashcards/${slug}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        return await res.json();
      } else {
        throw new Error(
          `Failed to fetch flashcards. Reason: ${res.statusText}`
        );
      }
    }
  );

  const remove = async () => {
    const res = await fetch(`/api/flashcards/${slug}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      mutate('/api/flashcards');
      return await res.json();
    } else {
      throw new Error(`Failed to delete flashcard. Reason: ${res.statusText}`);
    }
  };

  const update = async (data: Partial<Flashcard>) => {
    const res = await fetch(`/api/flashcards/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      mutate(`/api/flashcards/${slug}`);
      mutate('/api/flashcards');
      return await res.json();
    } else {
      throw new Error(`Failed to delete flashcard. Reason: ${res.statusText}`);
    }
  };

  return {
    flashcard,
    remove,
    update,
  };
}
