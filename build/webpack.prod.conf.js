'use strict'
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf'); // 基础配置
const config = require('./config'); // 配置
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UgligyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 拷贝文件
const HappyPack = require('happypack');

process.env.NODE_ENV = 'production'

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: 'source-map',
  output : {
    publicPath: config.build.assetsPublicPath,
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[id].[chunkhash:7].js'
  },
  module: {
    rules: []
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    // 每次打包前删除旧文件
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../')
    }),
    // 提取css文件
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[id].[contenthash:8].css'
    }),
    // 开启多个进程
    // new HappyPack({
    //   id: 'babel',
    //   threads: 4,
    //   loaders: ['loader-babel']
    // }),
    // 作用域提升
    new webpack.optimize.ModuleConcatenationPlugin(),
    // new webpack.DllPlugin({
    //   path: path.resolve(__dirname, './dist/dll', 'manifest.json'),
    // })
  ],
  // 提取公共代码
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //     cacheGroups: {
  //       vendors: {
  //         test: /[\\/]node_modules[\\/]/,
  //         chunks: 'all',
  //         name: 'vendors',
  //       },
  //       commons: {
  //         chunks: "async",
  //         name: "common-async",
  //         minSize: 0,
  //         minChunks: 2
  //       }
  //     }
  //   }
  // },
  // runtimeChunk: {
  //   name: "manifest"
  // }
})

module.exports = webpackConfig;
