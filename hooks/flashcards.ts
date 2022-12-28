import useSWR from 'swr';
import type { Flashcard } from '@prisma/client';

import { getter } from './fetchers';

export function useFlashcards() {
  return useSWR<Flashcard[]>('/api/flashcards', getter);
}

export function useFlashcard(slug: string) {
  return useSWR<Flashcard>(`/api/flashcards/${slug}`, getter);
}
