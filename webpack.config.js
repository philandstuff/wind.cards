const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OfflinePlugin = require('offline-plugin')
const path = require('path')
const webpack = require('webpack')

const copy = new CopyWebpackPlugin([
  {from: './netlify.toml', to: './'}
])
const html = new HtmlWebpackPlugin({
  template: 'bassoon/bassoon.html',
  filename: 'bassoon.html'
})
const offline = new OfflinePlugin({
  publicPath: '/',
  externals: ['/', 'bassoon'],
  excludes: ['bassoon.html'],
})
const extractText = new ExtractTextPlugin("./bassoon/bassoon.css")
const uglify = new webpack.optimize.UglifyJsPlugin({
  sourceMap: true
})

module.exports = {
  devtool: 'module-source-map',
  entry: './bassoon/bassoon.js',
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
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
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [['es2015', { modules: false }], 'react' ]
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
  plugins: [copy, html, extractText, uglify, offline ], // apparently it's better if offline is last
}
