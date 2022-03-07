const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  target: 'serverless',
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (isServer) {
      config.plugins.push(new webpack.IgnorePlugin(
        {
          resourceRegExp: /canvas/,
          contextRegExp: /jsdom$/,
        }))
    }
    return config
  },
  images: {
    domains: [
      's3.us-west-2.amazonaws.com',
      'www.notion.so',
      'images.unsplash.com'
    ]
  }
})
