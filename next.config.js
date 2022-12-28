/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/manage/flashcards',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
