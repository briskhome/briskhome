const path = require('path');
module.exports = {
  entry: path.resolve('./src/core.webapp/src/index.jsx'),
  output: {
    path: path.resolve('./lib/core.webapp/public/js'),
    filename: 'briskhome.bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0', 'react'],
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
