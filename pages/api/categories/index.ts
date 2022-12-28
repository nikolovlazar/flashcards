import { NextApiRequest, NextApiResponse } from 'next';

import { getCategories } from '../../../prisma/helpers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      res.status(200).json(await getCategories());
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
