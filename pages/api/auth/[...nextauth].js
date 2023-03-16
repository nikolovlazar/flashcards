import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import checkCredentials from '../user/check-credentials';

import prisma from '../../../prisma';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'hello@email.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials, req) => {
        const user = await fetch(`${NEXTAUTH_URL}/api/user/check-credentials`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
          body: Object.entries(credentials)
            .map((e) => e.join('='))
            .join('&'),
        })
          .then((res) => res.json())
          .catch((err) => {
            return null;
          });

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};
export default NextAuth(authOptions);
