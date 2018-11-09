'use strict'

// NODE_ENV: prod env mode
// BOWER_SERVER: vue data source, from websocket
// BOWER_CLIENT_HEARTCHECK_TIMEOUT: heartcheck timeout for front client connecting websocket 
// BOWER_CLIENT_RECONNECT_TIMEOUT: reconnect timeout for front client connecting websocket
module.exports = {
  NODE_ENV: '"production"',
  BOWER_SERVER: '"wss://localhost:3000/bower"',
  BOWER_CLIENT_HEARTCHECK_TIMEOUT: 5000,
  BOWER_CLIENT_RECONNECT_TIMEOUT: 5000
}
