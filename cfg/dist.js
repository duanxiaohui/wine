'use strict';

let path = require('path');
let webpack = require('webpack');

let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');

//分离css插件
let ExtractTextPlugin = require("extract-text-webpack-plugin");

let HtmlWebpackPlugin = require('html-webpack-plugin');

let config = Object.assign({}, baseConfig, {
  //entry: path.join(__dirname, '../src/index'),
  entry: {
    app: path.join(__dirname, '../src/index'),
    common: ['react','webpack-zepto']
  },
  output: {
    //path: path.join(__dirname, '../../webapp/dist/'),
    path: path.join(__dirname, './../dist/'),
    filename: '[hash].app.js',
    publicPath: `.${defaultSettings.publicPath}`
  },
  cache: false,
  devtool: 'sourcemap',
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false}
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.js'
    }),
    new ExtractTextPlugin("[name]-[hash].css", {allChunks: true}),
    new HtmlWebpackPlugin({                        //根据模板插入css/js等生成最终HTML
       filename:'./index.html',    //生成的html存放路径，相对于 path
       template:'./src/index.html',    //html模板路径
      //  inject:true,    //允许插件修改哪些内容，包括head与body
      //  hash:true,    //为静态资源生成hash值
      //  minify:{    //压缩HTML文件
      //      removeComments:true,    //移除HTML中的注释
      //      collapseWhitespace:false    //删除空白符与换行符
      //  }
   })
  ],
  module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'babel',
  include: [].concat(
    config.additionalPaths,
    [ path.join(__dirname, '/../src') ]
  )
});

module.exports = config;
