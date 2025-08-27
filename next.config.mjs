/** @type {import('next').NextConfig} */
const nextConfig = {
  // 개발 서버 최적화
  modularizeImports: {
    'lodash': {
      transform: 'lodash/{{member}}',
    },
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/**',
      },
    ],
  },
  // 번들 최적화 설정 추가
  webpack: (config, { dev, isServer }) => {
    // Production 최적화
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // React 관련
            react: {
              name: 'react',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // Recharts 분리
            recharts: {
              name: 'recharts',
              chunks: 'async',
              test: /[\\/]node_modules[\\/](recharts|d3-.*|recharts-scale)[\\/]/,
              priority: 30,
              enforce: true,
            },
            // Framer Motion 분리
            framer: {
              name: 'framer',
              chunks: 'async',
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              priority: 25,
              enforce: true,
            },
            // 기타 큰 라이브러리들
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
          },
        },
        runtimeChunk: {
          name: 'runtime',
        },
        minimize: true,
      };
    }
    return config;
  },
  // 실험적 기능 활성화
  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;