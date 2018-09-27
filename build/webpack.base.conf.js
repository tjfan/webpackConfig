'use strict'
 const path = require('path');
 const fs = require('fs');
 const config = require('./config');
 const HtmlWebpackPlugin = require('html-webpack-plugin');  // 用于生成html

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
    filename:`./html/${item}.html`,
    template: path.join(config.htmlPath, `./${item}.html`),
    chunks: [item, 'default', 'vendors'],
    // minify: process.env.NODE_ENV === 'development' ? false : {
    //   removeAttributeQuotes: true,  // 去除属性引用
    //   collapseWhitespace: true, // 折叠空白区域
    //   removeComments: true  // 移除html中的注释
    // }
    minify: {
      removeAttributeQuotes: true,  // 去除属性引用
      // collapseWhitespace: true, // 折叠空白区域
      // removeComments: true  // 移除html中的注释
    }
  }
  Entries[item] = config.jsPath + `${item}.js`
  HtmlPlugins.push(new HtmlWebpackPlugin(htmlConfig));
})
// const devMode = process.env.NODE_ENV == 'production' ? true : false;

function resolve(dir) {
  return path.resolve(__dirname, '..', dir);
}
module.exports = {
  context: config.projectPath,  // 入口、插件路径会基于context查找
  entry: Entries,
  resolve: {
    extensions: ['.js', '.css', '.json'],  // 自动补全文件的扩展名
    alias: {
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: [config.srcPath],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        include: [config.srcPath],
        exclude: [config.assetsSubDirectory],  // 忽略第三方的任何代码
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'fonts/[name].[hash:7].[ext]',
            fallback: 'file-loader'
          }
        }]
      },
      // 处理图片
      {
        test: /\.(png|jpg|gif|ttf|eot|woff(2)?)(\?[=a-z0-9]+)?$/,
        include: [config.srcPath],  // 在源文件目录中查找
        use: [{
          loader: 'url-loader',
          options: {
            publicPath: '../',
            limit: 8192,
            name: 'images/[name].[hash:7].[ext]',
            fallback: 'file-loader'  // 当图片大小超过8192时，回退使用file-loader
          }
        }]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'media/[name].[hash:7].[ext]',
          fallback: 'file-loader'
        }
      },
      {
        test: /\.(htm|html)$/,
        use: 'html-loader'
      }
    ]
  },
  plugins: [
    ...HtmlPlugins,
    // new MiniCssExtractPlugin({
    //   filename: devMode ? 'css/[name].css' : 'css/[name].[contenthash:8].css',
    //   chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[contenthash:8].css'
    // })
  ]
}
