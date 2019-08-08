const path = require('path')
const loadEnv = require('@kitten-team/env-inject').loadEnv
loadEnv({
  mode: process.env.npm_config_env,
  dir: path.resolve(__dirname, './env'),
  extname: 'yaml'
})
const {
  PORT
} = process.env

module.exports = {
  publicPath: '/account-manage-front/',
  devServer: {
    port: PORT,
    host: '0.0.0.0',
    disableHostCheck: true,
    open: true
  },
  css: {
    extract: false
  },
  pwa: {
    workboxOptions: {
      clientsClaim: true,
      skipWaiting: true
    }
  },
  pluginOptions: {
    scaffold: {
      // 用于引入svg图标到.vue文件
      // https://github.com/nguyenvanduocit/vue-cli-plugin-style-resources-loader
      svg: {
        dir: resolve('src/assets/svg'), // 只有这个目录下的svg图片才会被转成组件
        svgo: {
          plugins: [{
            removeDoctype: true
          },
          {
            removeComments: true
          },
          {
            removeUselessStrokeAndFill: true
          }
          ]
        }
      }
    },
    // 用于把css预处理器的公共模块自动引入到每个文件中
    // https://github.com/nguyenvanduocit/vue-cli-plugin-style-resources-loader
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/assets/styles/index.scss'),
        path.resolve(__dirname, 'src/assets/styles/mixins.scss')
      ]
    }
  }
}

function resolve(dir) {
  return path.join(__dirname, dir)
}
