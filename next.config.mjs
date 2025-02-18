/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      '6be7e0906f1487fecf0b9cbd301defd6.cdn.bubble.io',
      'raw.githubusercontent.com',
      'via.placeholder.com',
      'f1739891156847x894556854690081300.cdn.bubble.io',
      'f1739887156847x894556854690081300.cdn.bubble.io',
      'f1739884156847x894556854690081300.cdn.bubble.io',
      'images.pexels.com',
      'www.pexels.com',
      'pexels.com',
      'images.unsplash.com',
      'unsplash.com',
      'www.unsplash.com',
      'cdn.pixabay.com',
      'pixabay.com',
      'www.pixabay.com'
    ],
    unoptimized: true,
  },
  experimental: {
    missingSuspenseWithCSRError: false,
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}'
    }
  }
}

export default nextConfig;
