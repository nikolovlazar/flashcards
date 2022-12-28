import { NextApiRequest, NextApiResponse } from 'next';
import sluggify from 'slugify';

import {
  deleteFlashcard,
  getCategoryById,
  getFlashcard,
  updateFlashcard,
} from '../../../prisma/helpers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;
  const { id, question, answer, categoryId } = req.body;

  switch (req.method) {
    case 'GET':
      res.status(200).json(await getFlashcard(slug as string));
      break;
    case 'PUT':
      var category = await getCategoryById(categoryId);
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }

      var flashcard = await getFlashcard(slug as string);
      if (!flashcard) {
        res.status(404).json({ message: 'Flashcard not found' });
        return;
      }

      res.status(200).json(
        await updateFlashcard(flashcard.id, {
          question,
          answer,
          slug: sluggify(question, { lower: true }),
          category: {
            connect: {
              id: category.id,
            },
          },
        })
      );
      break;
    case 'DELETE':
      res.status(200).json(await deleteFlashcard(slug as string));
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
