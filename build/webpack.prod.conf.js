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
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

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
    rules: [
      {
        test: /\.(sa|sc|le|c)ss$/,
        include: [config.srcPath],
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
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
    // 压缩提取出的css，并解决ExtractTextPlugin分离出的js重复问题(多个文件引入同一css文件)
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      // cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        safe: true,
        autoprofixer: {disable: true},
        mergeLoghand: false,
        discardComments: {
          removeAll: true // 移除注释
        }
      },
      canPrint: true
    }),
    // 开启多个进程
    new HappyPack({
      id: 'babel',
      threads: 4,
      loaders: ['babel-loader']
    }),
    // 作用域提升
    new webpack.optimize.ModuleConcatenationPlugin(),
    // 注意使用DLLPlugin时，入口需要时数组
    // new webpack.DllPlugin({
    //   // context: __dirname,
    //   path: path.resolve(__dirname, '../dist/js/', '[name]-manifest.json'),
    //   name: '[name]-[hash]'
    // }),
    // 根据模块的相对路径生成一个四位数的hash作为模块id，建议用于生产环境
    // 当供应商模块不变时，保持module.id稳定
    new webpack.HashedModuleIdsPlugin(),
    // 复制静态资源
    new CopyWebpackPlugin([
      {
        from: config.assetsSubDirectory,
        to: './static',
        ignore: ['.*']
      }
    ])
  ],
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    minimizer: [
      // 压缩js
      new UgligyJSPlugin({
        exclude: /\.min\.js$/,
        cache: true,
        parallel: true, //开启并行压缩
        sourceMap: false,
        extractComments: true, //删除注释
        uglifyOptions: {
          compress: {
            unused: true, 
            warnings: false,
            drop_debugger: true
          },
          output: {
            beautify: false,  // 最紧凑的输出
            comments: false
          }
        }
      }),
    ],
    splitChunks: {
      chunks: 'all',
      name: true,
      minSize: 20000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      // automaticNameDelimiter: '~'
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          priority: -10,
          reuseExistingChunk: false,
          test: /node_modules\/(.*)\.js/
        },
        default: {
          name: 'default',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
})

module.exports = webpackConfig;
