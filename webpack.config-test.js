const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

const html = new HtmlWebpackPlugin({
  template: 'bassoon/bassoon.html',
  filename: 'bassoon.html'
})
const extractText = new ExtractTextPlugin("./bassoon/bassoon.css")
const uglify = new webpack.optimize.UglifyJsPlugin({
  sourceMap: true
})
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node', // webpack should compile node compatible code
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
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
  plugins: [html, extractText, uglify ],
};
