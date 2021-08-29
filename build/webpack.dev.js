const path = require('path');
const webpackBase = require('./webpack.base');
const webpackMerge = require('webpack-merge');
const config = require('./config');

// 调试单个页面 npm run dev -- --page expert/expertdetail
// let debugSinglePage = '';
// process.argv.forEach((val, index) => {
// 	if (val.indexOf('--page') === 0) {
// 		debugSinglePage = process.argv[index + 1] + '.html';
// 	}
// });

module.exports = webpackMerge(webpackBase, {
  mode: 'development',
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
        test: /\.(js|vue)$/,
        enforce: 'pre', // 强制先进行 ESLint 检查
        exclude: /node_modules|lib/,
        loader: 'eslint-loader',
        options: {
          // 启用自动修复
          fix: true,
          // 启用警告信息
          emitWarning: true,
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/, // 处理图片
        use: {
          loader: 'file-loader', // 解决打包css文件中图片路径无法解析的问题
          options: {
            // 打包生成图片的名字
            name: '[name].[hash:8].[ext]',
            // 图片的生成路径
            outputPath: config.imgOutputPath,
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/, // 处理字体
        use: {
          loader: 'file-loader',
          options: {
            outputPath: config.fontOutputPath,
          }
        }
      }
    ]
  },
  devServer: {
    contentBase: config.devServerOutputPath,
    overlay: {
      errors: true,
      warnings: true,
    },
    open: true, // 服务启动后 打开浏览器
    // openPage: debugSinglePage ? debugSinglePage : '/index.html'
    proxy: {
			'/api': {
				target: 'http://localhost:8080/',
				changeOrigin: true
			}
		}
  }
});