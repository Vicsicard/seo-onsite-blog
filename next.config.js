/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/**',
      }
    ],
    domains: [
      'raw.githubusercontent.com',
      '6be7e0906f1487fecf0b9cbd301defd6.cdn.bubble.io'
    ],
  },
};

module.exports = nextConfig;
