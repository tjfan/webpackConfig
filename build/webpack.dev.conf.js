'use strict'
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

module.exports = merge(baseWebpackConfig, {
  // mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    port: 8080,
    host: 'localhost',
    overlay: true,
    compress: true, // 可选，压缩
    open: true,
    hot: true,
    inline: true,
    progress: true
  },
  plugins: [ 
    new webpack.HotModuleReplacementPlugin(), // 启动热更新
    new webpack.NamedChunksPlugin()
  ]
})
