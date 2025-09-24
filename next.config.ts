import type { NextConfig } from 'next';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  // Performance optimizations
  experimental: {
    // Optimize package imports for better tree shaking
    optimizePackageImports: [
      'framer-motion',
      '@supabase/supabase-js',
      'recharts',
      'lucide-react',
      'react-icons',
      'lodash',
      'dayjs',
      'moment'
    ],
  },
  // Webpack optimization
  webpack: (config, { isServer }) => {
    // Module replacement for production
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Use dynamic Supabase in production
        ...(process.env.NODE_ENV === 'production' && {
          'src/lib/supabase': 'src/lib/supabase-dynamic'
        })
      };
    }

    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
