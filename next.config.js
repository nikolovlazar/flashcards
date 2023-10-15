// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/manage/flashcards",
        permanent: false,
      },
      {
        source: "/manage",
        destination: "/manage/flashcards",
        permanent: false,
      },
    ];
  },
};

const sentryWebpackPluginOptions = {
  org: "sentry-devrel",
  project: "flashcards",
  silent: true,
};

const sentryOptions = {
  widenClientFileUpload: true,
  hideSourceMaps: true,
};

module.exports = withSentryConfig(
  nextConfig,
  sentryWebpackPluginOptions,
  sentryOptions,
);
