'use strict';
const path = require('path');
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base.conf'); // 基础配置
const merge = require('webpack-merge');
const config = require('./config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MyPlugin = require('./plugin/my-plugin');

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: 'none',
  plugins: [
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: './public/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    }),
    // new CleanWebpackPlugin()
    new MyPlugin({
      outputpath: 'dist',
      name: 'JSZIP'
    })
  ]
})

module.exports = webpackConfig;
