import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: async ({ req }) => {
      if (req.nextUrl.href.endsWith('/api/user/check-credentials')) {
        return true;
      }
      const hasSession =
        !!req.cookies.get('next-auth.session-token') ||
        !!req.cookies.get('__Secure-next-auth.session-token');

      return hasSession;
    },
  },
});
