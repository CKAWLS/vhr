let proxyObj = {};

proxyObj['/'] = {
  ws: true,
  target: 'http://localhost:8081',
  changeOrigin: true, //是否允许跨域
  pathRewrite: {
    '^/': ''
  }
}

module.exports = {
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: proxyObj
  }
}