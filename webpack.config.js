const nodeEnv = (process.env.NODE_ENV || 'production').trim()

module.exports = nodeEnv === 'development'
  ? require('./config/webpack.config.dev')
  : require('./config/webpack.config.prod')
