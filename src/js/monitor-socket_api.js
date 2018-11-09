// File: monitor-socket.js
// Note: websocket bower client, connect the websocket server named BowerServer
//      collect data for vue
// make a log directory

var log4js = require('log4js')
var log = log4js.getLogger('apiClient')
var common = require('lodash')
var WebSocket = require('wss')

// ApiClient constructed
var ApiClient = function ApiClient () {
  var address = process.env.BOWER_SERVER || 'ws://localhost:3000/api'
  log.info('[BowerClient] client connect:', address)

  this.apiClient = new WebSocket(address, [], {})
  this.clientId = (process.env.HOST || 'localhost') + ':' +
        (process.env.PORT || '3001') + '_' +
        common.random(0, 1000)

  this.nodeInfo = {
    id: this.clientId,
    info: {
      name: 'test_api_2',
      os: 'test_os_1',
      os_v: 'test_os_v1',
      client: 'test_client_1',
      netVersion: 1,
      shard: 1,
      protocol: 'test_protocol_1',
      api: 'test_api_1',
      port: 30000,
      canUpdateHistory: true,
      node: true
    },
    stats: {
      active: true,
      mining: false,
      syncing: true,
      peers: 2
    },
    latency: 0,
    block: {
      height: 2342352,
      timestamp: 122266999457689,
      difficulty: 42090990,
      txcount: 61,
      miners: 'test_minier_1'
    },
    netVersion: 1,
    shard: 1
  }
  return this
}

ApiClient.prototype.VueSetupListener = function () {
  var self = this
  // this.apiClient.on('connect', function(){
  this.apiClient.on('open', function open () {
    log.info('[BowerClient] client connected.')
    log.info(self.nodeInfo)
    var sendData = {
      'emit': [
        'hello',
        self.nodeInfo
      ]
    }
    self.apiClient.send(JSON.stringify(sendData))
  })

  this.apiClient.on('node-pong', function (data) {
    // funcNodePong(self, data);
    log.info('[BowerClient] process: client node-pong.')
    var resData = {id: null, latency: null}
    if (common.isUndefined(data)) {
      resData = {id: null, latency: null}
    } else if (common.isUndefined(data.clientTime)) {
      resData = {id: data.id, latency: null}
    } else {
      resData = {
        id: data.id,
        latency: Math.ceil((common.now() - data.clientTime) / 2),
        netVersion: self.nodeInfo.info.netVersion,
        shard: self.nodeInfo.info.shard
      }
    }
    var sendData = {
      'emit': [
        'latency',
        resData
      ]
    }
    self.apiClient.send(JSON.stringify(sendData))
    log.info('client node-pong data:', resData)
  })

  this.apiClient.on('message', function incoming (data) {
    log.info('[BowerClient] data: received some data', data)
    var receiveData
    try {
      receiveData = JSON.parse(data)
    } catch (err) {
      log.error('[APIServer] receive invalid data: ', data, ' err:', err)
      return false
    }
    if (!common.isUndefined(receiveData) && !common.isUndefined(receiveData.emit) && receiveData.emit.length > 0) {
      var dataTag = receiveData.emit[0]
      var dataInfo = receiveData.emit[1]
      if (common.isUndefined(dataInfo) || common.isUndefined(dataInfo.id)) {
        log.debug('[APIServer] receive invalid data.')
        return
      }
      switch (dataTag) {
        case 'node-pong':
          // data format: {id:xx, clientTime:{}, serverTime:{}}
          var resData = {id: null, latency: null}
          if (common.isUndefined(data)) {
            resData = {id: null, latency: null}
          } else if (common.isUndefined(dataInfo.clientTime)) {
            resData = {id: dataInfo.id, latency: null}
          } else {
            resData = {
              id: dataInfo.id,
              latency: Math.ceil((common.now() - dataInfo.clientTime) / 2),
              netVersion: self.nodeInfo.info.netVersion,
              shard: self.nodeInfo.info.shard
            }
          }
          var sendData = {
            'emit': [
              'latency',
              resData
            ]
          }
          self.apiClient.send(JSON.stringify(sendData))
          log.info('client node-pong data:', resData)
          break
      }
    }
  })

  setInterval(function () {
    var reqData = {
      id: self.clientId,
      clientTime: common.now()
    }
    var sendData = {
      'emit': [
        'node-ping',
        reqData
      ]
    }
    self.apiClient.send(JSON.stringify(sendData))
    log.info('node-ping data:', reqData)
  }, 3000)
}

module.exports = ApiClient
