import { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';
import sluggify from 'slugify';

import {
  deleteFlashcard,
  getCategoryById,
  getFlashcard,
  getUserFromSession,
  updateFlashcard,
} from '../../../prisma/helpers';
import { getSession } from '../../../utils/auth';

export default async function Api(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  const { question, answer, categoryId } = req.body;

  const session = await getSession(req, res);
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  const user = await getUserFromSession(session);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  switch (req.method) {
    case 'GET':
      var flashcard = await getFlashcard(slug as string, user);
      if (!flashcard) {
        return res.status(404).json({ message: 'Not found' });
      }
      if (flashcard.userId !== user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      res.status(200).json(flashcard);
      break;
    case 'PUT':
      const scope = Sentry.getCurrentHub().getScope();
      const transaction = scope?.getTransaction();

      var category = await getCategoryById(categoryId);

      const categoryChecksSpan = transaction?.startChild({
        op: 'function',
        description: 'Category checks',
      });

      if (!category) {
        categoryChecksSpan?.setStatus('not_found');
        categoryChecksSpan?.finish();
        return res.status(404).json({ message: 'Category not found' });
      }
      if (category.userId !== user.id) {
        categoryChecksSpan?.setStatus('unauthenticated');
        categoryChecksSpan?.finish();
        return res.status(401).json({ message: 'Unauthorized' });
      }

      categoryChecksSpan?.finish();

      var flashcard = await getFlashcard(slug as string, user);

      const flashcardChecksSpan = transaction?.startChild({
        op: 'function',
        description: 'Flashcard checks',
      });

      if (!flashcard) {
        flashcardChecksSpan?.setStatus('not_found');
        flashcardChecksSpan?.finish();
        return res.status(404).json({ message: 'Not found' });
      }
      if (
        !question ||
        !answer ||
        question.length === 0 ||
        answer.length === 0
      ) {
        flashcardChecksSpan?.setStatus('unauthenticated');
        flashcardChecksSpan?.finish();
        return res.status(400).json({ message: 'Invalid data' });
      }

      flashcardChecksSpan?.finish();

      var updated = await updateFlashcard(flashcard.id, {
        question,
        answer,
        slug: sluggify(question, { lower: true }),
        category: {
          connect: {
            id: category.id,
          },
        },
      });

      res.status(200).json(updated);
      break;
    case 'DELETE':
      var flashcard = await getFlashcard(slug as string, user);

      if (!flashcard) {
        return res.status(404).json({ message: 'Not found' });
      }
      if (flashcard.userId !== user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const deleted = await deleteFlashcard(slug as string, user);
      res.status(200).json(deleted);
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
