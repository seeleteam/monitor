'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

// NODE_ENV: dev env mode
// BOWER_SERVER: vue data source, from websocket
// BOWER_CLIENT_HEARTCHECK_TIMEOUT: heartcheck timeout for front client connecting websocket 
// BOWER_CLIENT_RECONNECT_TIMEOUT: reconnect timeout for front client connecting websocket
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BOWER_SERVER: '"ws://localhost:3000/bower"',
  BOWER_CLIENT_HEARTCHECK_TIMEOUT: 60000,
  BOWER_CLIENT_RECONNECT_TIMEOUT: 3000
})