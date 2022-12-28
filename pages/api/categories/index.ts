import { NextApiRequest, NextApiResponse } from 'next';
import sluggify from 'slugify';

import { createCategory, getCategories } from '../../../prisma/helpers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      res.status(200).json(await getCategories());
      break;
    case 'POST':
      const { name } = req.body;

      res.status(200).json(
        await createCategory({
          name,
          slug: sluggify(name, { lower: true }),
        })
      );
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
