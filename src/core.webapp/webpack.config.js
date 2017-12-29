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
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
