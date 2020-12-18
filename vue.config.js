module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: process.env.NODE_ENV === 'production'
    ? 'staff/'
    : '/',
    // ? 'http://185.22.64.44/teacher/'
  // indexPath: process.env.NODE_ENV === 'production'
  //   ? '/staff/'
  //   : '/'

  // chainWebpack: (config) => {
  //   config.module
  //     .rule('images')
  //     .use('url-loader')
  //     .tap(options => Object.assign({}, options, { name: 'staff/[name].[ext]' }));
  // },
  // css: {
  //   extract: {
  //     filename: 'staff/css/[name].css',
  //     chunkFilename: 'staff/css/[name].css',
  //   },
  // },
  // configureWebpack: {
  //   output: {
  //     filename: 'staff/js/[name].js',
  //     chunkFilename: 'staff/js/[name].js',
  //   }
  // }
}