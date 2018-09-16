'use strict'
const path = require('path');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const webpack = require('webpack');
const env = require('../config/prod.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HappyPack = require('happypack');


const webpackConfig = merge(baseWebpackConfig, {
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    // 每次打包前删除旧文件
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../')
    }),
    new HtmlWebpackPlugin({
      template: './src/html/index.html',
      hash: true,
      minify: {
        removeAttributeQuotes: true  // 去掉引号，减小文件大小
      }
    }),
    // 提取css文件
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css'
    }),
    // 开启多个进程
    new HappyPack({
      id: 'babel',
      threads: 4,
      loaders: ['loader-babel']
    }),
    // 作用域提升
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DllPlugin({
      path: path.resolve(__dirname, './dist/dll', 'manifest.json'),
    })
  ],
  // 提取公共代码
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'vendors',
        },
        commons: {
          chunks: "async",
          name: "common-async",
          minSize: 0,
          minChunks: 2
        }
      }
    }
  },
  runtimeChunk: {
    name: "manifest"
  }
})

module.exports = webpackConfig;