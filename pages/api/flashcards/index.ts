import { NextApiRequest, NextApiResponse } from 'next';
import sluggify from 'slugify';

import {
  createFlashcard,
  getCategory,
  getFlashcards,
} from '../../../prisma/helpers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      res.status(200).json(await getFlashcards());
      break;
    case 'POST':
      const { question, answer, categoryId } = req.body;

      var category = await getCategory(categoryId);
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }

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
        })
      );
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
