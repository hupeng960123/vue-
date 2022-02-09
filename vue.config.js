const path = require("path");
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']

function resolve(dir) {
  return path.join(__dirname, "./", dir);
}

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: "static/anjian",
  indexPath: "templates/anjian_index.html",
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
    // svg rule loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      });
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 生产环境
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]', // 提示示compression-webpack-plugin@3.0.0的话asset改为filename
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        })
      );

    } else {
      // 开发环境

    }
  },
  devServer: {
    proxy: {
      "^/api": {
        target: "http://192.168.1.143:8002/",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/" //重写接口
        }
      },
      "^/static": {
        target: "http://192.168.1.143:8002/",
        changeOrigin: true,
        // pathRewrite: {
        //   "^/admin/static": "/static" //重写接口
        // }
      },
      "^/media": {
        target: "http://192.168.1.143:8002/",
        changeOrigin: true
        // pathRewrite: {
        //   "^/": "/" //重写接口
        // }
      },
      "^/": {
        target: "http://192.168.1.143:8002/",
        changeOrigin: true
        // pathRewrite: {
        //   "^/": "/" //重写接口
        // }
      }
    },
    port: 8006
  }
};
