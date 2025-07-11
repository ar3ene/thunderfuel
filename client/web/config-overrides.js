const path = require('path');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "buffer": require.resolve("buffer"),
    "util": require.resolve("util"),
    "url": require.resolve("url"),
    "assert": require.resolve("assert"),
  };
  
  return config;
};
