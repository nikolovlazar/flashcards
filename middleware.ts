import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: async ({ req }) => {
      const hasSession = !!req.cookies._parsed.get('next-auth.session-token');
      return hasSession;
    },
  },
});
