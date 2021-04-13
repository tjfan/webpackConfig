'use strict'
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');  // 引入基础配置
const config = require('./config');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: config.dev.devtool,  // 开启sourceMap,生产环境下不使用
  devServer: {
    contentBase: '../dist',
    open: false,
    host: config.dev.host,
    port: config.dev.port,
    useLocalIp: false,  // 允许浏览器使用本地ip打开
    hot: true,  // 配合webpack.NamedModulesPlugin、webpack.HotModuleReplacementPlugin完成
    compress: true,  // 一切服务都启用gzip压缩
    quiet: false, // 启动quiet后，除了初始启动信息以外的任何内容都不会被打印到node控制台
    overlay: true,  // 在浏览器中显示编译错误
    inline: true, // 内敛模式 实时重载的脚本插入到你的（bundle）中，并且构建消息将出现在浏览器控制台
    clientLogLevel: 'warning', // 内联模式  那些消息将出现在浏览器控制台

    historyApiFallback: {  // 当使用HTML5 History Api 时，任意的404响应是否被替代为index.html
      rewrites: [
        {
          from: /\.*/,
          to: path.posix.join(config.dev.assetsPublicPath, 'public/index.html')
        }
      ]
    },
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|le|c)ss$/,
        include: [config.srcPath],
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',  // 开发环境中如果自动添加前缀，可能影响性能。只在生产环境中添加即可
          'less-loader'
        ]
      }
    ]
  },
  plugins: [ 
    new webpack.NamedChunksPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: './public/index.html',
      template: './public/index.html',
      inject: true
    }),
  ]
})
