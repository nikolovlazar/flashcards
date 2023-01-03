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

  const transaction = Sentry.getCurrentHub().getScope()?.getTransaction();

  switch (req.method) {
    case 'GET':
      var span = transaction?.startChild({
        op: 'db.query',
        description: 'Get flashcard',
      });
      var flashcard = await getFlashcard(slug as string, user);
      if (!flashcard) {
        span?.setStatus('Failed: Not found');
        span?.finish();
        transaction?.finish();
        return res.status(404).json({ message: 'Not found' });
      }
      if (flashcard.userId !== user.id) {
        span?.setStatus('Failed: Unauthorized');
        span?.finish();
        transaction?.finish();
        return res.status(401).json({ message: 'Unauthorized' });
      }

      span?.finish();
      transaction?.finish();

      res.status(200).json(flashcard);
      break;
    case 'PUT':
      var span = transaction?.startChild({
        op: 'db.query',
        description: 'Update flashcard',
      });
      var category = await getCategoryById(categoryId);
      if (!category) {
        span?.setStatus('Failed: Category not found');
        span?.finish();
        transaction?.finish();

        return res.status(404).json({ message: 'Category not found' });
      }
      if (category.userId !== user.id) {
        span?.setStatus('Failed: Unauthorized');
        span?.finish();
        transaction?.finish();

        return res.status(401).json({ message: 'Unauthorized' });
      }

      var flashcard = await getFlashcard(slug as string, user);
      if (!flashcard) {
        span?.setStatus('Failed: Not found');
        span?.finish();
        transaction?.finish();

        return res.status(404).json({ message: 'Not found' });
      }
      if (flashcard.userId !== user.id) {
        span?.setStatus('Failed: Unauthorized');
        span?.finish();
        transaction?.finish();

        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (
        !question ||
        !answer ||
        question.length === 0 ||
        answer.length === 0
      ) {
        span?.setStatus('Failed: Invalid data');
        span?.finish();
        transaction?.finish();

        return res.status(400).json({ message: 'Invalid data' });
      }

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
      span?.finish();
      transaction?.finish();

      res.status(200).json(updated);
      break;
    case 'DELETE':
      var span = transaction?.startChild({
        op: 'db.query',
        description: 'Delete flashcard',
      });
      var flashcard = await getFlashcard(slug as string, user);

      if (!flashcard) {
        span?.setStatus('Failed: Not found');
        span?.finish();
        transaction?.finish();

        return res.status(404).json({ message: 'Not found' });
      }
      if (flashcard.userId !== user.id) {
        span?.setStatus('Failed: Unauthorized');
        span?.finish();
        transaction?.finish();

        return res.status(401).json({ message: 'Unauthorized' });
      }

      const deleted = await deleteFlashcard(slug as string, user);
      span?.finish();
      transaction?.finish();
      res.status(200).json(deleted);
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
