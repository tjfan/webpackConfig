'use strict';

const path = require('path');
const utils = require('./utils');

const config = {
  projectPath: utils.resolve('/'),  // 项目根目录
  srcPath: utils.resolve('/src/'),   // 源文件目录
  node_modulesPath: utils.resolve('/node_modules/'), //node_modules目录
  htmlPath: utils.resolve('/src/html/'), // html目录
  jsPath: utils.resolve('/src/js/'),  // js目录
  // igonreJs: utils.resolve('/src/main/'),  // 没有入口js文件的目录
  assetsSubDirectory: utils.resolve('/src/static/'),  // 静态资源目录（不做第三方处理）

  dev: {
    host: 'localhost',
    port: '8080',
    useESlint: false,
    showESlintErrorInOverlay: false,
    devSourceMap: false,
    devtool: 'cheap-module-eval-source-map',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': 'http://localhost: 8080'
    }
  },

  build: {
    index: path.resolve(__dirname, '../dist/index.html'),
    prodSourceMap: false,
    devtool: 'cheap-module-source-map',
    assetsRoot: path.resolve(__dirname, '../dist'),  // 构建根目录
    assetsPublicPath: '/',  // 相对于服务器根目录的路径，用于加载构建好的资源
  }
}

module.exports = config;
