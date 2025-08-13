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
    ],
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;