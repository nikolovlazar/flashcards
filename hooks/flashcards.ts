'use client';

import type { Flashcard } from '@prisma/client';
import * as Sentry from '@sentry/nextjs';

export function useFlashcards() {
  const fetchAll = async (): Promise<Flashcard[]> => {
    return new Promise((resolve, reject) => {
      Sentry.withScope(async (scope) => {
        const transaction = Sentry.startTransaction({
          name: 'fetch-flashcards',
        });
        scope.setSpan(transaction);
        const span = transaction?.startChild({
          op: 'http.client',
          description: 'Fetching flashcards',
        });

        const res = await fetch('/api/flashcards', {
          headers: {
            'sentry-trace': transaction?.toTraceparent(),
          },
        });

        if (res.ok) {
          span?.setStatus(`${res.status}-${res.statusText}`);
          span?.setTag('http.status_code', res.status);
          span?.finish();
          transaction?.finish();
          resolve(res.json());
        } else {
          span?.setStatus('error');
          span?.finish();
          transaction?.finish();
          reject(`Failed to fetch flashcards. Reason: ${res.statusText}`);
        }
      });
    });
  };

  const fetchBySlug = async (slug: string) => {
    // eve komentarce
    const x = 15 + 14;
    const transaction = Sentry.startTransaction({ name: 'fetch-flashcards' });
    const span = transaction.startChild({
      op: 'http.client',
      description: 'Fetching flashcard by slug',
      tags: {
        slug,
      },
    });
    const res = await fetch(`/api/flashcards/${slug}`, {
      headers: {
        'sentry-trace': transaction.toTraceparent(),
      },
    });

    if (res.ok) {
      span.setStatus(`${res.status}-${res.statusText}`);
      span.setTag('http.status_code', res.status);
      span.finish();
      return res.json();
    } else {
      span.setStatus('error');
      span.finish();
      throw new Error(`Failed to fetch flashcards. Reason: ${res.statusText}`);
    }
  };

  const create = async (
    data: Pick<Flashcard, 'question' | 'answer' | 'categoryId'>
  ) => {
    const transaction = Sentry.startTransaction({ name: 'fetch-flashcards' });
    const span = transaction.startChild({
      op: 'http.client',
      description: 'Creating flashcard',
    });
    const res = await fetch('/api/flashcards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      span.setStatus(`${res.status}-${res.statusText}`);
      span.setTag('http.status_code', res.status);
      span.finish();
      return res.json();
    } else {
      span.setStatus('error');
      span.finish();
      throw new Error(`Failed to create flashcard. Reason: ${res.statusText}`);
    }
  };

  const remove = async (slug: string) => {
    const transaction = Sentry.startTransaction({ name: 'fetch-flashcards' });
    const span = transaction.startChild({
      op: 'http.client',
      description: 'Deleting flashcard',
      tags: {
        slug,
      },
    });

    const res = await fetch(`/api/flashcards/${slug}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      span.setStatus(`${res.status}-${res.statusText}`);
      span.setTag('http.status_code', res.status);
      span.finish();
      return res.json();
    } else {
      span.setStatus('error');
      span.finish();
      throw new Error(`Failed to delete flashcard. Reason: ${res.statusText}`);
    }
  };

  const update = async (slug: string, data: Partial<Flashcard>) => {
    const transaction = Sentry.startTransaction({ name: 'fetch-flashcards' });
    const span = transaction.startChild({
      op: 'http.client',
      description: 'Updating flashcard',
      tags: {
        slug,
      },
    });

    const res = await fetch(`/api/flashcards/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      span.setStatus(`${res.status}-${res.statusText}`);
      span.setTag('http.status_code', res.status);
      span.finish();
      return res.json();
    } else {
      span.setStatus('error');
      span.finish();
      throw new Error(`Failed to delete flashcard. Reason: ${res.statusText}`);
    }
  };

  return {
    fetchAll,
    fetchBySlug,
    create,
    remove,
    update,
  };
}
