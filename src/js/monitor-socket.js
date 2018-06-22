// File: monitor-socket.js
// Note: websocket bower client, connect the websocket server named BowerServer
//    collect data for vue
var common = require('lodash')
var address = process.env.BOWER_SERVER || 'ws://localhost:3000/bower'
var lockReconnect = false

// VueClient constructed
var VueClient = function VueClient (vueDataMain, vueDataTest) {
  this.vueClient = new WebSocket(address)

  this.vueDataMain = vueDataMain
  this.vueDataTest = vueDataTest

  this.clientId = address + '_' + common.random(0, 1000)

  return this
}

// VueClient setEventListener
VueClient.prototype.VueSetupListener = function () {
  var self = this
  var bowerClientHeartcheckTimeout = process.env.BOWER_CLIENT_HEARTCHECK_TIMEOUT || 5000
  var heartCheck = {
    timeout: Number(bowerClientHeartcheckTimeout),
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function () {
      clearTimeout(this.timeoutObj)
      clearTimeout(this.serverTimeoutObj)
      this.start()
    },
    start: function () {
      // var startSelf = this
      this.timeoutObj = setTimeout(function () {
        var hearData = {
          'tag': 'hearcheck', 'message': {'id': self.clientId, 'msg': 'HeartBeat'}
        }
        self.vueClient.send(JSON.stringify(hearData))
        // startSelf.serverTimeoutObj = setTimeout(function () {
        //   self.vueClient.close()
        // }, startSelf.timeout)
      }, this.timeout)
    }
  }

  function reconnect (url) {
    if (lockReconnect) return
    lockReconnect = true
    var bowerClientReconnectTimeout = process.env.BOWER_CLIENT_RECONNECT_TIMEOUT || 5000
    setTimeout(function () {
      self.vueClient = new WebSocket(address)
      self.clientId = self.vueClient.id
      lockReconnect = false
    }, Number(bowerClientReconnectTimeout))
  }

  // ===========event about connect=============================
  // open event
  this.vueClient.onopen = function () {
    heartCheck.reset()
    heartCheck.start()
    console.log('[BowerClient] client connected.')
    var resData = {
      'tag': 'hello', 'message': {'id': self.clientId}
    }
    self.vueClient.send(JSON.stringify(resData))
  }

  // close event
  this.vueClient.onclose = function (code, reason) {
    console.log('[BowerClient] client disconnect,code: ', code, ' reason: ', reason)
    reconnect(address)
  }

  // error event
  this.vueClient.onerror = function (err) {
    console.log('[BowerClient] Socket error:', err)
    reconnect(address)
  }

  // message event
  this.vueClient.onmessage = function (event) {
    heartCheck.reset()
    heartCheck.start()
    var resData
    try {
      resData = JSON.parse(event.data)
    } catch (err) {
      console.log('[BowerClient] receive invalid data: ', event.data, ' err:', err)
      return false
    }

    if (!common.isUndefined(resData)) {
      var dataTag = resData.tag
      if (common.isUndefined(resData.message)) {
        console.log('[BowerClient] receive invalid data.')
        return
      }
      switch (dataTag) {
        case 'init':
          // data format: {id:xx, info:{}, stats:{}, block:{}}
          if (!common.isUndefined(resData.message)) {
            self.vueDataMain = resData.message.main
            self.vueDataTest = resData.message.test
          }
          break
        case 'maindata':
          // ping data format: {tag: 'stats', message:{id:xx, clientTime:xx}}
          // pong data format: {id:xx, clientTime:xx, serverTime: xx}
          self.vueDataMain = resData.message
          break
        case 'testdata':
          // ping data format: {tag: 'stats', message:{id:xx, clientTime:xx}}
          // pong data format: {id:xx, clientTime:xx, serverTime: xx}
          self.vueDataTest = resData.message
          break
      }
    }
  }
}

VueClient.prototype.getVueDataMain = function () {
  return this.vueDataMain
}

VueClient.prototype.getVueDataTest = function () {
  return this.vueDataTest
}

export default VueClient
