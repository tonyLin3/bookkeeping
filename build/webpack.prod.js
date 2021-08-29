// 引入基础配置
const path = require('path');
const webpackBase = require('./webpack.base');
// 引入 webpack-merge 插件
const webpackMerge = require('webpack-merge');
// 清理 dist 文件夹
const CleanWebpackPlugin = require('clean-webpack-plugin');
// js压缩、优化插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// 抽取css extract-text-webpack-plugin不再支持webpack4，官方出了mini-css-extract-plugin来处理css的抽取
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const config = require('./config'); // 多页面的配置项
// 合并配置文件
module.exports = webpackMerge(webpackBase, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'postcss-loader',
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
						//浏览器添加前缀
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: [require('autoprefixer')]
						}
					},
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                resources: path.resolve(__dirname, '../src/styles/bundle.less')
              }
            }
          },
          {
						loader: 'style-resources-loader',
						options: {
							patterns: [
								'src/styles/bundle.less'
							]
						}
					}
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/, // 处理图片
        use: {
          loader: 'file-loader', // 解决打包css文件中图片路径无法解析的问题
          options: {
            // 打包生成图片的名字
            name: '[name].[hash:8].[ext]',
            publicPath: config.imgPublicPath,
            outputPath: config.imgOutputPath,
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/, // 处理字体
        use: {
          loader: 'file-loader',
          options: {
            publicPath: config.fontPublicPath,
            outputPath: config.fontOutputPath
          }
        }
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({ // 压缩js
        uglifyOptions: {
          compress: {
            warnings: false,
            drop_debugger: false,
            drop_console: true
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({ // 压缩css
        cssProcessorOptions: {
          safe: true
        }
      })
    ]
  },
  plugins: [
    // 自动清理 dist 文件夹
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '..'),
      verbose: true, //开启在控制台输出信息
      dry: false,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash:8].css'
    })
  ]
});