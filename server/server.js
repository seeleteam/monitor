var log = require('log4js').getLogger('server')
var http = require('http')
var server = http.createServer()

// Init data model
var MonitorData = require('./model/MonitorData')
// monitorData for main net
var monitorDataForMainNet = new MonitorData()
// monitorData for test net
var monitorDataForTestNet = new MonitorData()

var BowerData = require('./model/BowerData')
// monitorData for main net
var bowerDataForMainNet = new BowerData()
// monitorData for test net
var bowerDataForTestNet = new BowerData()

// Init ApiServer websocket
var ApiServer = require('./api_server')
var wsServerForAPI = new ApiServer(server, monitorDataForMainNet, monitorDataForTestNet)
wsServerForAPI.ApiSetupListener()

// Init BowerServer websocket
var BowerServer = require('./bower_server')
var wsServerForBower = new BowerServer(server, monitorDataForMainNet, bowerDataForMainNet, monitorDataForTestNet, bowerDataForTestNet)
wsServerForBower.BowerSetupListener()

server.on('upgrade', function upgrade (request, socket, head) {
  const pathname = require('url').parse(request.url).pathname
  if (pathname === '/api') {
    wsServerForAPI.apiServer.handleUpgrade(request, socket, head, function done (client) {
      wsServerForAPI.apiServer.emit('connection', client, request)
    })
  } else if (pathname === '/bower') {
    wsServerForBower.bowerServer.handleUpgrade(request, socket, head, function done (client) {
      wsServerForBower.bowerServer.emit('connection', client, request)
    })
  } else {
    socket.destroy()
  }
})

server.on('error', err => console.error(err))

server.timeout = 0

var port = process.env.SERVER_PORT || 3000
server.listen(port, function () {
  log.info('[WSServer] listen *:' + port)
})

module.exports = server
