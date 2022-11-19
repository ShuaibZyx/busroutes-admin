const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8074, //项目运行的端口号
    host: "localhost",
    open: true,
    https: false,
    proxy: {
      "/api": {
        target: "http://101.42.172.82:3008/", //服务端的接口地址
        ws: true,
        changeOrigin: true, //开启跨域
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
})
