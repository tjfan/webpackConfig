'use strict';
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base.conf'); // 基础配置
const merge = require('webpack-merge');
const config = require('./config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const webpackConfig = merge(baseWebpackConfig, {
  devtool: config.build.devtool,
  plugins: [
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: './public/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    // new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
})

module.exports = webpackConfig;
