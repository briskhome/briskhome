const path = require('path');

module.exports = {
  entry: './app',
  output: {
    path: path.resolve('./lib/core.webapp/public/assets/js'),
    publicPath: '/',
    filename: 'briskhome.bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['flow', 'react'],
        },
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
