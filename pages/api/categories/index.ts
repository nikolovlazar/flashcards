import { NextApiRequest, NextApiResponse } from 'next';
import sluggify from 'slugify';

import {
  createCategory,
  getCategories,
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
      res.status(200).json(await getCategories(user));
      break;
    case 'POST':
      const { name } = req.body;

      res.status(200).json(
        await createCategory({
          name,
          slug: sluggify(name, { lower: true }),
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
