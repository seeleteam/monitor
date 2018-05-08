// File: bower_server.js
// Note: websocket server for seele-monitor vue, transfer data for vue module.
var log = require('log4js').getLogger('bowerserver')
var WebSocket = require('ws')
var common = require('lodash')

// BowerServer constructed
var BowerServer = function BowerServer (server, monitorDataMain, bowerDataMain, monitorDataTest, bowerDataTest) {
  this.bowerServer = new WebSocket.Server({
    noServer: true,
    verifyClient: function (info) {
      return true
    }
  })
  this.bower_client = null
  this.monitorDataMain = monitorDataMain
  this.monitorDataTest = monitorDataTest

  this.bowerDataMain = bowerDataMain
  this.bowerDataTest = bowerDataTest

  return this
}

// BowerServer listen event setup
BowerServer.prototype.BowerSetupListener = function () {
  var self = this
  log.debug('main bowerData: ', self.bowerDataMain.getBowerData())
  log.debug('test bowerData: ', self.bowerDataTest.getBowerData())

  this.bowerServer.on('connection', function connection (client) {
    self.bower_client = client
    log.info('[BowerServer] client connected.')

    client.on('message', function (data) {
      var resData
      try {
        resData = JSON.parse(data)
      } catch (err) {
        log.error('[BowerServer] receive invalid data: ', data, ' err:', err)
        return false
      }
      if (!common.isUndefined(resData)) {
        var dataTag = resData.tag
        if (common.isUndefined(resData.message) || common.isUndefined(resData.message.id)) {
          log.warn('[BowerServer] receive invalid data: ', resData)
          return
        }
        switch (dataTag) {
          case 'hello':
            // data format: {id:xx, info:{}, stats:{}, block:{}}
            log.debug('[BowerServer] message[hello]: ', resData.message)
            funcHello(self, client, resData.message)
            break
          case 'client-ping':
            // ping data format: {tag: 'stats', message:{id:xx, clientTime:xx}}
            // pong data format: {id:xx, clientTime:xx, serverTime: xx}
            log.debug('[BowerServer] message[client-ping]: ', resData.message)
            funcClientPing(self, client, resData.message)
            break
        }
      }
    })

    client.on('error', function error (err) {
      log.error('[BowerServer] do process error event.', err)
    })

    client.on('close', function (code, reason) {
      log.warn('[BowerServer] client disconnect,code: ', code, ' reason: ', reason)
    })
    // ----------------------------------------------------------------
    // Event process function
    var funcHello = function (server, client, data) {
      log.info('[BowerServer] process: hello.')

      var initData = {
        'tag': 'init',
        'message': {
          main: self.bowerDataMain.getBowerData(),
          test: self.bowerDataTest.getBowerData()
        }
      }
      client.send(JSON.stringify(initData))
    }

    var funcClientPing = function (server, client, data) {
      log.info('[BowerServer] process: client ping.')
      var pingResData
      if (common.isUndefined(data)) {
        log.error('[BowerServer] client-ping: data is null')
        pingResData = {
          id: null,
          clientTime: null,
          serverTime: common.now()
        }
      } else if (common.isUndefined(data.clientTime)) {
        pingResData = {
          id: data.id,
          clientTime: null,
          serverTime: common.now()
        }
      } else {
        pingResData = {
          id: data.id,
          clientTime: data.clientTime,
          serverTime: common.now()
        }
      }
      pingResData = {
        'tag': 'client-pong',
        'message': pingResData
      }
      client.send(JSON.stringify(pingResData))
      log.debug('client-pong data:', pingResData)
    }
  })

  setInterval(function () {
    if (self.monitorDataMain.monitorUpdateFlag) {
      log.debug('write to client monitorDataMain: ', self.monitorDataMain)
      self.bowerDataMain.transferToBowerData(self.monitorDataMain)
      log.debug('write to client bowerDataMain: ', self.bowerDataMain)
      self.monitorDataMain.monitorUpdateFlag = false
      if (self.bowerDataMain.blockUpdateFlag || self.bowerDataMain.nodeUpdateFlag) {
        self.bowerDataMain.blockUpdateFlag = false
        self.bowerDataMain.nodeUpdateFlag = false
        if (self.bower_client !== null && self.bower_client.readyState === WebSocket.OPEN) {
          var intervalResDataMain = {
            'tag': 'maindata',
            'message': self.bowerDataMain.getBowerData()
          }
          log.debug(intervalResDataMain)
          self.bowerServer.clients.forEach(function each(clientTmp) {
            if (clientTmp.readyState === WebSocket.OPEN) {
                clientTmp.send(JSON.stringify(intervalResDataMain));
            }
          })
        }
      }
    }

    if (self.monitorDataTest.monitorUpdateFlag) {
      log.debug('write to client monitorDataTest: ', self.monitorDataTest)
      self.bowerDataTest.transferToBowerData(self.monitorDataTest)
      log.debug('write to client bowerDataTest: ', self.bowerDataTest)
      self.monitorDataTest.monitorUpdateFlag = false
      if (self.bowerDataTest.blockUpdateFlag || self.bowerDataTest.nodeUpdateFlag) {
        self.bowerDataTest.blockUpdateFlag = false
        self.bowerDataTest.nodeUpdateFlag = false
        if (self.bower_client !== null && self.bower_client.readyState === WebSocket.OPEN) {
          var intervalResDataTest = {
            'tag': 'testdata',
            'message': self.bowerDataTest.getBowerData()
          }
          log.debug(intervalResDataTest)
          self.bowerServer.clients.forEach(function each(clientTmp) {
            if (clientTmp.readyState === WebSocket.OPEN) {
                clientTmp.send(JSON.stringify(intervalResDataTest));
            }
          })          
        }
      }
    }
  }, process.env.BOWER_SERVER_DATA_UPDATE_INTERVAL || 5000)
}

module.exports = BowerServer
