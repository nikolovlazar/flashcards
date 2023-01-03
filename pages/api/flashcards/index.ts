import { NextApiRequest, NextApiResponse } from 'next';
import sluggify from 'slugify';
import * as Sentry from '@sentry/nextjs';

import {
  createFlashcard,
  getCategoryById,
  getFlashcards,
  getUserFromSession,
} from '../../../prisma/helpers';
import { getSession } from '../../../utils/auth';

export default async function Api(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  const user = await getUserFromSession(session);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const transaction = Sentry.getCurrentHub().getScope()?.getTransaction();

  switch (req.method) {
    case 'GET':
      var span = transaction?.startChild({
        op: 'db.query',
        description: 'Get flashcards',
      });
      var flashcards = await getFlashcards(user);
      span?.finish();
      transaction?.finish();
      res.status(200).json(flashcards);
      break;
    case 'POST':
      var span = transaction?.startChild({
        op: 'db.query',
        description: 'Create flashcard',
      });
      const { question, answer, categoryId } = req.body;

      if (question.length === 0 || answer.length === 0) {
        span?.setStatus('invalid_argument');
        span?.finish();
        transaction?.finish();

        return res
          .status(400)
          .json({ message: 'Question and answer required' });
      }

      var category = await getCategoryById(Number(categoryId));
      if (!category) {
        span?.setStatus('not_found');
        span?.finish();
        transaction?.finish();

        return res.status(404).json({ message: 'Category not found' });
      }
      if (category.userId !== user.id) {
        span?.setStatus('unauthenticated');
        span?.finish();
        transaction?.finish();

        return res.status(401).json({ message: 'Unauthorized' });
      }

      var flashcard = await createFlashcard({
        question,
        answer,
        slug: sluggify(question, { lower: true }),
        category: {
          connect: {
            id: category.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      });
      span?.finish();
      transaction?.finish();

      res.status(200).json(flashcard);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
