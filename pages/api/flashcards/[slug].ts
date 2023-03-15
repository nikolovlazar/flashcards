import { NextApiRequest, NextApiResponse } from 'next';
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
      var category = await getCategoryById(categoryId);

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      if (category.userId !== user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      var flashcard = await getFlashcard(slug as string, user);

      if (!flashcard) {
        return res.status(404).json({ message: 'Not found' });
      }
      if (
        !question ||
        !answer ||
        question.length === 0 ||
        answer.length === 0
      ) {
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
