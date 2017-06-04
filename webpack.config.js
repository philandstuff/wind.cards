const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OfflinePlugin = require('offline-plugin')
const path = require('path')
const webpack = require('webpack')

const html = new HtmlWebpackPlugin({
  template: 'bassoon/bassoon.html',
  filename: 'bassoon.html'
})
const offline = new OfflinePlugin
const extractText = new ExtractTextPlugin("./bassoon/bassoon.css")
const uglify = new webpack.optimize.UglifyJsPlugin({
  sourceMap: true
})

module.exports = {
  devtool: 'module-source-map',
  entry: './bassoon/bassoon.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [ 'es2015', { modules: false } ]
          ]
        }
      },
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
  plugins: [html, offline, extractText, uglify ],
}
