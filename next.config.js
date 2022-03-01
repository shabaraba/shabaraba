module.exports = {
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
  }
}
