'use strict';
 const path = require('path');
 const fs = require('fs');
 const config = require('./config');
 const VueLoaderPlugin = require('vue-loader/lib/plugin');

function resolve(dir) {
  return path.resolve(__dirname, '..', dir);
}
module.exports = {
  context: path.resolve(__dirname, '../'),  // 入口、插件路径会基于context查找
  entry: {
    app: './src/main.js'
  },
  output: {
    filename: '[name].js',
    path: config.build.assetsRoot,
    publicPath: config.build.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.css', '.json', '.ts', '.vue'],  // 自动补全文件的扩展名
    alias: {
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
