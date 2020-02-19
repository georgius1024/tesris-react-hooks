const merge = require('webpack-merge')
const common = require('./webpack-common.config')
const dev = require('./webpack-dev.config')
const prod = require('./webpack-prod.config')
module.exports = (env, arg) => {
  if (arg.mode === 'production') {
    return merge(common(arg.mode), prod())
  } else {
    return merge(common(arg.mode), dev())
  }
}
