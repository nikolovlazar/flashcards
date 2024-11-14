// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://b2eb323005f457b73af27badcf467fcd@o4506044970565632.ingest.us.sentry.io/4508297782427648',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  tracePropagationTargets: ['localhost', 'api'],

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
