/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic configuration only
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;