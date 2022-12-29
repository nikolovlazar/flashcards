import { NextApiRequest, NextApiResponse } from 'next';
import sluggify from 'slugify';

import {
  createFlashcard,
  getCategoryById,
  getFlashcards,
  getUserFromSession,
} from '../../../prisma/helpers';
import { getSession } from '../../../utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req, res);
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  const user = await getUserFromSession(session);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  switch (req.method) {
    case 'GET':
      res.status(200).json(await getFlashcards(user));
      break;
    case 'POST':
      const { question, answer, categoryId } = req.body;

      var category = await getCategoryById(Number(categoryId));
      if (!category)
        return res.status(404).json({ message: 'Category not found' });
      if (category.userId !== user.id)
        return res.status(401).json({ message: 'Unauthorized' });

      res.status(200).json(
        await createFlashcard({
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
        })
      );
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
