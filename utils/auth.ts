import { unstable_getServerSession } from 'next-auth/next';
import type { NextApiRequest, NextApiResponse } from 'next/types';

import { authOptions } from '../pages/api/auth/[...nextauth]';

export const getSession = async (req: NextApiRequest, res: NextApiResponse) => {
  return await unstable_getServerSession(req, res, authOptions);
};
