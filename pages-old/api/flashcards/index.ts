import { NextApiRequest, NextApiResponse } from 'next';
import sluggify from 'slugify';

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

  switch (req.method) {
    case 'GET':
      var flashcards = await getFlashcards(user);
      res.status(200).json(flashcards);
      break;
    case 'POST':
      const { question, answer, categoryId } = req.body;

      if (question.length === 0 || answer.length === 0) {
        return res
          .status(400)
          .json({ message: 'Question and answer required' });
      }

      var category = await getCategoryById(Number(categoryId));
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      if (category.userId !== user.id) {
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

      res.status(200).json(flashcard);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
