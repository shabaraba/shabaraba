module.exports = {
  target: 'serverless',
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (isServer) {
      config.plugins.push(new webpack.IgnorePlugin(
        {
          resourceRegExp: /canvas/,
          contextRegExp: /jsdom$/,
        }))
      // config.module.rules.push({
      //   test: /\.node$/,
      //   __dirname: false,
      //   use: [
      //     {
      //       loader: "node-loader",
      //     },
      //   ],
      // })
    }
    return config
  }
}
