import useSWR, { mutate } from 'swr';

import type { Flashcard } from '@prisma/client';
import * as Sentry from '@sentry/nextjs';

export function useFlashcards() {
  const { data: flashcards } = useSWR<Flashcard[]>(
    '/api/flashcards',
    async () => {
      return new Promise((resolve, reject) => {
        Sentry.withScope(async (scope) => {
          const transaction = Sentry.startTransaction({
            name: 'fetch-flashcards',
            op: 'http.client',
          });
          scope.setSpan(transaction);
          const span = transaction?.startChild({
            op: 'http.client',
            description: 'Fetching flashcards',
          });

          const res = await fetch('/api/flashcards', {
            headers: {
              'Content-Type': 'application/json',
              'sentry-trace': transaction?.toTraceparent(),
            },
          });

          if (res.ok) {
            span.setStatus('Ok');
            span.setTag('http.status_code', res.status);
            resolve(res.json());
          } else {
            span.setStatus('UnknownError');
            reject(`Failed to fetch flashcards. Reason: ${res.statusText}`);
          }
          span.finish();
          transaction?.finish();
        });
      });
    }
  );

  const create = async (
    data: Pick<Flashcard, 'question' | 'answer' | 'categoryId'>
  ) => {
    return new Promise((resolve, reject) => {
      Sentry.withScope(async (scope) => {
        const transaction = Sentry.startTransaction({
          name: 'create-flashcard',
          op: 'http.client',
        });
        scope.setSpan(transaction);
        const span = transaction.startChild({
          op: 'http.client',
          description: 'Creating flashcard',
        });
        const res = await fetch('/api/flashcards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'sentry-trace': transaction.toTraceparent(),
          },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          mutate('/api/flashcards');
          span.setStatus('Ok');
          span.setTag('http.status_code', res.status);
          resolve(await res.json());
        } else {
          span.setStatus('UnknownError');
          reject(`Failed to create flashcard. Reason: ${res.statusText}`);
        }
        span.finish();
        transaction.finish();
      });
    });
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
      return new Promise((resolve, reject) => {
        Sentry.withScope(async (scope) => {
          const transaction = Sentry.startTransaction({
            name: 'fetch-flashcard',
            op: 'http.client',
          });
          scope.setSpan(transaction);
          const span = transaction.startChild({
            op: 'http.client',
            description: 'Fetching flashcard by slug',
            tags: {
              slug,
            },
          });
          const res = await fetch(`/api/flashcards/${slug}`, {
            headers: {
              'Content-Type': 'application/json',
              'sentry-trace': transaction.toTraceparent(),
            },
          });

          if (res.ok) {
            span.setStatus('Ok');
            span.setTag('http.status_code', res.status);
            resolve(await res.json());
          } else {
            span.setStatus('UnknownError');
            reject(`Failed to fetch flashcards. Reason: ${res.statusText}`);
          }
          span.finish();
          transaction.finish();
        });
      });
    }
  );

  const remove = async () => {
    return new Promise((resolve, reject) => {
      Sentry.withScope(async (scope) => {
        const transaction = Sentry.startTransaction({
          name: 'remove-flashcard',
          op: 'http.client',
        });
        scope.setSpan(transaction);
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
            'sentry-trace': transaction.toTraceparent(),
          },
        });

        if (res.ok) {
          mutate('/api/flashcards');
          span.setStatus('Ok');
          span.setTag('http.status_code', res.status);
          resolve(await res.json());
        } else {
          span.setStatus('UnknownError');
          reject(`Failed to delete flashcard. Reason: ${res.statusText}`);
        }
        span.finish();
        transaction.finish();
      });
    });
  };

  const update = async (data: Partial<Flashcard>) => {
    return new Promise((resolve, reject) => {
      Sentry.withScope(async (scope) => {
        const transaction = Sentry.startTransaction({
          name: 'update-flashcard',
          op: 'http.client',
        });
        scope.setSpan(transaction);
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
            'sentry-trace': transaction.toTraceparent(),
          },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          mutate(`/api/flashcards/${slug}`);
          mutate('/api/flashcards');
          span.setStatus('Ok');
          span.setTag('http.status_code', res.status);
          resolve(await res.json());
        } else {
          span.setStatus('UnknownError');
          reject(`Failed to delete flashcard. Reason: ${res.statusText}`);
        }
        span.finish();
        transaction.finish();
      });
    });
  };

  return {
    flashcard,
    remove,
    update,
  };
}
