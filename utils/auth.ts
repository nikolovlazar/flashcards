import { unstable_getServerSession } from 'next-auth/next';
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next/types';

import { authOptions } from '../pages/api/auth/[...nextauth]';

type Req = GetServerSidePropsContext['req'] | NextApiRequest;
type Res = GetServerSidePropsContext['res'] | NextApiResponse;

export const getSession = async (req: Req, res: Res) => {
  return await unstable_getServerSession(req, res, authOptions);
};
