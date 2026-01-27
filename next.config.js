/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },

  // Transpile Remotion packages for proper bundling
  transpilePackages: [
    'remotion',
    '@remotion/player',
    '@remotion/cli',
    '@remotion/renderer',
    '@remotion/bundler',
    '@remotion/transitions',
    '@remotion/shapes',
    '@remotion/paths',
    '@remotion/media-utils',
    '@remotion/preload',
    '@remotion/gif',
    '@remotion/noise',
    '@remotion/motion-blur',
    '@remotion/three',
    '@remotion/lottie',
    '@remotion/lambda',
    '@remotion/cloudrun',
  ],

  webpack: (config, { isServer }) => {
    // Handle .mjs files
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    // Resolve aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };

    // Externals for server-side rendering
    if (isServer) {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      });
    }

    return config;
  },

  // Image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
};

module.exports = nextConfig;
