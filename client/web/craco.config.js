const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // 添加 Node.js polyfills
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer"),
        "util": require.resolve("util"),
        "url": require.resolve("url"),
        "assert": require.resolve("assert"),
        "http": false,
        "https": false,
        "os": false,
        "path": false,
        "fs": false,
      };

      // 添加 Buffer polyfill 到全局
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new (require('webpack')).ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        }),
      ];

      return webpackConfig;
    },
  },
  // 禁用 ESLint 检查以避免依赖问题
  eslint: {
    enable: false,
  },
};
