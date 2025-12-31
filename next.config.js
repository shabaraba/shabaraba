const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_ACTIVE_THEME: process.env.NEXT_PUBLIC_ACTIVE_THEME || 'theme2',
    ARTICLE_SOURCE: process.env.ARTICLE_SOURCE || 'notion',
    BUILD_TIME: Date.now().toString(), // OGP画像のキャッシュバスティング用タイムスタンプ
  },
  // Turbopack configuration (empty config to silence the warning)
  turbopack: {},
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias.jsdom = false;

    if (isServer) {
      config.plugins.push(new webpack.IgnorePlugin({
        resourceRegExp: /canvas/,
        contextRegExp: /jsdom$/,
      }))
    }
    return config
  },
  typescript: {
    // !! WARN !!
    // Temporary solution - disabling type checking at build time
    // Remove this when dependencies are properly updated
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'www.notion.so',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ]
  },
  output: 'export',
  async redirects() {
    return [
      {
        source: '/posts/:path*',
        destination: '/blog/posts/:path*',
        permanent: true,
      },
    ]
  }
};

module.exports = withBundleAnalyzer(nextConfig);
