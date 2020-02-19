const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = () => ({
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './public',
    publicPath: '/',
    compress: true,
    hot: true,
    open: true,
    clientLogLevel: 'info',
    overlay: {
      warnings: true,
      errors: true
    }
  }
})
