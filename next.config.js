const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (isServer) {
      config.plugins.push(new webpack.IgnorePlugin(
        {
          resourceRegExp: /canvas/,
          contextRegExp: /jsdom$/,
        }))
    };
    return config
  },
  typescript: {
    // !! WARN !!
    // Temporary solution - disabling type checking at build time
    // Remove this when dependencies are properly updated
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporary solution - disabling eslint at build time
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: [
      's3.us-west-2.amazonaws.com',
      'www.notion.so',
      'images.unsplash.com',
    ]
  }
};

module.exports = withBundleAnalyzer(nextConfig);
