import { NextApiRequest, NextApiResponse } from 'next';
import sluggify from 'slugify';

import {
  createCategory,
  deleteCategory,
  getCategory,
  updateCategory,
} from '../../../prisma/helpers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;
  const { id, name } = req.body;

  switch (req.method) {
    case 'GET':
      res.status(200).json(await getCategory(slug as string));
      break;
    case 'POST':
      var category = await getCategory(id);
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }

      res.status(200).json(
        await createCategory({
          name,
          slug: sluggify(name),
        })
      );
      break;
    case 'PUT':
      var category = await getCategory(id);
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }

      res.status(200).json(
        await updateCategory(id, {
          name,
          slug: sluggify(name),
        })
      );
      break;
    case 'DELETE':
      res.status(200).json(await deleteCategory(slug as string));
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
