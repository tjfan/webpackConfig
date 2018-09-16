'use strict'
 const path = require('path');
 const fs = require('fs');
 const config = require('./config');
//  const webpack = require('webpack');
 const HtmlWebpackPlugin = require('html-webpack-plugin');  // 用于生成html
//  const CleanWebpackPlugin = require('clean-webpack-plugin');
//  const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 获取所有html文件的集合，用于生成入口
const getFileNameList = (path) => {
  let fileList = [];
  let dirList = fs.readdirSync(path);
  dirList.forEach(item => {
    if (item.indexOf('html') > -1) {
      fileList.push(item.split('.')[0]);
    }
  })
  return fileList;
}
let htmlDirs = getFileNameList(config.htmlPath);


// 根据每个html文件生成HtmlWebpackPlugin实例和入口列表
let HtmlPlugins = [];  // 保存HtmlWebpackPlugin实例
let Entries = {};  // 保存入口列表
htmlDirs.forEach(item => {
  let htmlConfig = {
    filename: `${item}`,
    template: path.join(config.htmlPath, `./${item}.html`),
    chunks: [item, 'default', 'vendors'],
    minify: process.env.NODE_ENV === 'development' ? false : {
      removeAttributeQuotes: true,  // 去除属性引用
      collapseWhitespace: true, // 折叠空白区域
      removeComments: true  // 移除html中的注释
    }
  }
  Entries[item] = config.jsPath + `${item}.js`
  HtmlPlugins.push(new HtmlWebpackPlugin(htmlConfig));
})

 module.exports = {
  context: config.projectPath,  // 入口、插件路径会基于context查找
  entry: Entries,
  resolve: {
    extensions: ['.js', '.vue', '.css', '.json'],  // 自动补全文件的扩展名
    alias: {
      '@': resolve('src')
    }
  }
  //  context: path.resolve(__dirname, '..'),
  //  entry: './src/js/index.js',
  //  output: {
  //    path: path.resolve(__dirname, '../dist'),
  //    filename: 'js/[name].[chunkhash:8].js',
  //  },
  //  module: {
  //    rules: [
  //     {
  //       test: /\.(sa|sc|le|c)ss$/,
  //       // use: [
  //       //   devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
  //       //   'css-loader'
  //       // ],
  //       use: [
  //         {
  //           loader: MiniCssExtractPlugin.loader,
  //           options: {
  //             publicPath: '../'
  //           }
  //         },
  //         'css-loader'
  //       ],
  //       include: path.resolve(__dirname, '../src'),
  //       exclude: /node_modules/
  //     },
  //     // 处理图片
  //     {
  //       test: /\.(png|jpg|gif|ttf|eot|woff(2)?)(\?[=a-z0-9]+)?$/,
  //       use: [{
  //         loader: 'url-loader',
  //         options: {
  //           limit: 8192,
  //           name: 'images/[name].[hash:7].[ext]'         
  //         }
  //       }]
  //     },
  //     {
  //       test: /\.(htm|html)$/,
  //       use: 'html-loader'
  //     }
  //   ]
  //  },
  //  plugins: [
    // new CleanWebpackPlugin(['dist'], {
    //   root: path.resolve(__dirname, '../')
    // }),
    // new HtmlWebpackPlugin({
    //   template: './src/html/index.html',
    //   hash: true,
    //   minify: {
    //     removeAttributeQuotes: true
    //   }
    // }),
    // new MiniCssExtractPlugin({
    //   filename: devMode ? 'css/[name].css' : 'css/[name].[contenthash:8].css',
    //   chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[contenthash:8].css'
    // })
  // ]
 }