import { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';
import sluggify from 'slugify';

import {
  deleteCategory,
  getCategory,
  getUserFromSession,
  updateCategory,
} from '../../../prisma/helpers';
import { getSession } from '../../../utils/auth';

export default async function Api(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  const { name } = req.body;

  const session = await getSession(req, res);
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  const user = await getUserFromSession(session);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  switch (req.method) {
    case 'GET':
      var category = await getCategory(slug as string, user);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      if (category.userId !== user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      res.status(200).json(category);
      break;
    case 'PUT':
      var category = await getCategory(slug as string, user);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      if (category.userId !== user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      var updated = await updateCategory(category.id, {
        name,
        slug: sluggify(name, { lower: true }),
      });

      res.status(200).json(updated);
      break;
    case 'DELETE':
      var category = await getCategory(slug as string, user);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      if (category.userId !== user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const deleted = await deleteCategory(slug as string, user);

      res.status(200).json(deleted);
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
