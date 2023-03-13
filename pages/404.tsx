import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { captureMessage } from '@sentry/nextjs';

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    if (!!router.asPath) {
      captureMessage(`404 - ${router.asPath}`, {
        level: 'error',
      });
    }
  }, [router]);

  return <h1>404 - Page Not Found</h1>;
}
