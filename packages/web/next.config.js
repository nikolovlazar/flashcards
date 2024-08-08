/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/manage",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
