const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ARTICLE_SOURCE: process.env.ARTICLE_SOURCE || 'notion',
    BUILD_TIME: Date.now().toString(),
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_OWNER: process.env.GITHUB_OWNER,
    GITHUB_REPO: process.env.GITHUB_REPO,
    GITHUB_BRANCH: process.env.GITHUB_BRANCH,
  },
  typescript: {
    // !! WARN !!
    // Temporary solution - disabling type checking at build time
    // Remove this when dependencies are properly updated
    ignoreBuildErrors: true,
  },
  turbopack: {},
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
};

module.exports = withBundleAnalyzer(nextConfig);
