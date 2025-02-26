/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'raw.githubusercontent.com',
      'github.com',
      'images.unsplash.com',
      'onsite-blog-images.s3.amazonaws.com',
      'onsite-blog-images.s3.us-west-2.amazonaws.com'
    ],
    // Enable image optimization for better Core Web Vitals
    unoptimized: false
  },
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // Add output configuration
  output: 'standalone',
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Add trailing slash
  trailingSlash: true,
  // Add powered by header
  poweredByHeader: false,
}

module.exports = nextConfig
