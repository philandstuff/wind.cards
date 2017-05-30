const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OfflinePlugin = require('offline-plugin')
const path = require('path');

const html = new HtmlWebpackPlugin({
  template: './bassoon.html',
  filename: 'bassoon.html'
})
const offline = new OfflinePlugin
const extractText = new ExtractTextPlugin("./css/bassoon.css")

module.exports = {
  entry: './js/bassoon.js',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.svg$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.html$/,
        use: [ 'html-loader?attrs=object:data img:src' ]
      }
    ]
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'assets/'),
  },
  plugins: [html, offline, extractText],
}
