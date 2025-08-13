/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output configuration for deployment (commented for local dev)
  // output: "standalone",
  
  // Transpile packages for compatibility
  transpilePackages: ["@radix-ui/*"],
  
  // Balanced experimental features (performance vs stability)
  experimental: {
    optimizePackageImports: ["lucide-react"],
    // Disable problematic optimizations that cause build errors
    optimizeServerReact: false,
    optimizeCss: false,
  },
  
  // Image optimization with security and performance
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
  
  // Simplified webpack configuration for stability
  webpack: (config, { isServer }) => {
    // Client-side fallbacks only
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
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Security headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      // Cache optimization
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;