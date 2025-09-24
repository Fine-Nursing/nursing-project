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
  async rewrites() {
    // 프로덕션과 개발 환경 모두 지원
    const backendUrl = process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:3000';

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  // Test commit for rollback branch
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
