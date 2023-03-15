import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../prisma';
import sha256 from 'crypto-js/sha256';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    await handlePOST(res, req);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}

const hashPassword = (password: string) => {
  return sha256(password).toString();
};

async function handlePOST(res: NextApiResponse, req: NextApiRequest) {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      password: true,
    },
  });
  if (user) {
    if (user.password == hashPassword(req.body.password)) {
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(400).end('Invalid credentials');
    }
  } else {
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        password: hashPassword(req.body.password),
      },
    });
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  }
}
