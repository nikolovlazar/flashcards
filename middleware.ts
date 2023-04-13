import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: async ({ req }) => {
      const hasSession =
        !!req.cookies.get('next-auth.session-token') ||
        !!req.cookies.get('__Secure-next-auth.session-token');
      return hasSession;
    },
  },
});
