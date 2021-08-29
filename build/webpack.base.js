const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./config'); // 多页面的配置项
const envConfig = require(`../env/${process.env.PACK_MODE}`);

// 模板和入口
let HTMLPlugins = [];
let Entries = {};
// 当前时间时间戳作为缓存刷新key
const curTimeStamp = new Date().getTime();
// 环境和资源地址
const env = process.env.PACK_MODE.trim();
let ASSET_PATH = '/'; // dev 环境
if (env == 'prod') ASSET_PATH = '/static/'

// 调试单个页面 npm run dev -- --page expert/expertdetail
// let debugSinglePage = '';
// process.argv.forEach((val, index) => {
// 	if (val.indexOf('--page') === 0) {
// 		debugSinglePage = process.argv[index + 1] + '.html';
//     let filterArr = config.htmlArr.filter(item => item.dir + '/' + item.page + '.html' == debugSinglePage);
//     config.htmlArr = filterArr;
//     console.log('config.htmlArr', config.htmlArr);
// 	}
// });

config.htmlArr.forEach(item => {
  let filename = `${item.page}.html`;
  let entryjs = `../src/pages/${item.page}/index.js`;
  if (item.dir) {
    filename = `${item.dir}/${item.page}.html`;
    entryjs = `../src/pages/${item.dir}/${item.page}/index.js`;
  };
  const htmlPlugin = new HTMLWebpackPlugin({
    title: item.title, 
    filename: filename,
    template: path.resolve(__dirname, `../src/template/index.html`), 
    chunks: [item.page, 'vendor'],
    inject: true,
    hash: false, //开启hash  ?[hash]
    cv: curTimeStamp,
    minify:
        env === 'dev'
            ? false
            : {
                    removeComments: true, //移除HTML中的注释
                    collapseWhitespace: true, //折叠空白区域 也就是压缩代码
                    removeAttributeQuotes: true //去除属性引用
                }
  });
  HTMLPlugins.push(htmlPlugin);
  Entries[item.page] = path.resolve(__dirname, entryjs); // 根据配置设置入口js文件
});

module.exports = {
  entry: Entries,
  output: {
    publicPath: '/',
    filename: 'js/[name].[hash:8].js',
    path: path.resolve(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /\.vue$/, // 处理vue模块
        use: 'vue-loader',
      },
      {
        test: /\.js$/, //处理es6语法
        exclude: /node_modules/,
        use: ['babel-loader'],
      }
    ]
  },
  resolve: { // 设置模块如何被解析
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@styles': path.resolve(__dirname, '../src/styles'),
      '@assets': path.resolve(__dirname, '../src/assets'),
      '@vuex': path.resolve(__dirname, '../src/store'),
      '@mixins': path.resolve(__dirname, '../src/mixins'),
    },
    extensions:['*','.css','.js','.vue']
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../public'),
        to: path.resolve(__dirname, '../dist'),
        ignore: ['*.html']
      },
      {
        from: path.resolve(__dirname, '../src/lib'),
        to: path.resolve(__dirname, '../dist/static')
      }
    ]),
    new webpack.DefinePlugin({
        'process.env': {
            ASSET_PATH: JSON.stringify(ASSET_PATH),
            PACK_MODE: JSON.stringify(env)
        }, 
        __SITE_BASE_URL__: envConfig.__SITE_BASE_URL__,
        __REST_BASE_URL__: envConfig.__REST_BASE_URL__,
        __REST_SOCKET_URL__: envConfig.__REST_SOCKET_URL__,
        __REST_FILE_URL__: envConfig.__REST_FILE_URL__,
        __REST_CHAT_URL__: envConfig.__REST_CHAT_URL__,
        __SITE_AUTHCENTER__: envConfig.__SITE_AUTHCENTER__,
        __SITE_VRHOME__: envConfig.__SITE_VRHOME__,
        __SITE_MALLHOME__: envConfig.__SITE_MALLHOME__,
        __SITE_DOMIN_URL__: envConfig.__SITE_DOMIN_URL__,
        __SITE_LANG__: envConfig.__SITE_LANG__,
        __SITE_VERSION__: envConfig.__SITE_VERSION__,
        __CDN_STATIC_URL__: envConfig.__CDN_STATIC_URL__,
        __PLATFORM__: envConfig.__PLATFORM__
    }),
    ...HTMLPlugins, // 利用 HTMLWebpackPlugin 插件合成最终页面
  ]
};
