/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile packages for compatibility
  transpilePackages: ["@radix-ui/*"],
  
  // Experimental features for performance
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost', 
        port: '8001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '123.30.238.194',
        port: '8001',
        pathname: '/uploads/**',
      },
    ],
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Handle hydration issues in production
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Suppress hydration warnings for browser extension injected content
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;