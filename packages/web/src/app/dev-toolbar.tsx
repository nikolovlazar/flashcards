'use client';

import { useEffect } from 'react';

export function DevToolbar() {
  useEffect(() => {
    const env = process.env.SENTRY_ENVIRONMENT || 'development';
    const isDev = env === 'development' || env === 'staging';

    if (window && (window as any).SentryToolbar && isDev) {
      (window as any).SentryToolbar.init({
        organizationSlug: 'sentry-devrel',
        projectIdOrSlug: '4506045517135872',
      });
    }
  }, []);

  return <></>;
}
