// File: api_server.js
// Note: websocket server for seele-monitor-api, collection data from seele node.
var log = require('log4js').getLogger('apiserver')
var WebSocket = require('ws')
var common = require('lodash')
var http = require('http')

// ApiServer constructed
var ApiServer = function ApiServer (server, monitorDataMain, monitorDataTest) {
  this.apiServer = new WebSocket.Server({
    noServer: true,
    verifyClient: function (info) {
      return true
    }
  })
  this.api_client = null
  this.monitorDataMain = monitorDataMain
  this.monitorDataTest = monitorDataTest
  this.clientStateList = []

  return this
}

// ApiServer listen event setup
ApiServer.prototype.ApiSetupListener = function () {
  var self = this
  log.debug('main monitor data: ', this.monitorDataMain)
  log.debug('test monitor data: ', this.monitorDataTest)
  this.apiServer.on('connection', function connection (client, request) {
    self.api_client = client
    var clientIp = process.env.SERVER_NGINX ? request.headers['x-forwarded-for'].split(/\s*,\s*/)[0] : request.connection.remoteAddress
    var ipRegx = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/
    var ipResult = ipRegx.exec(clientIp)
    if (!common.isUndefined(ipResult) && ipResult !== null && ipResult.length !== 0) {
      clientIp = ipResult[0]
    }
    log.info('[APIServer] client(', clientIp, ') connected')
    client.on('message', function (data) {
      var resData
      try {
        resData = JSON.parse(data)
      } catch (err) {
        log.error('[APIServer] receive invalid data: ', data, ' err:', err)
        return false
      }
      if (!common.isUndefined(resData) && !common.isUndefined(resData.emit) && resData.emit.length > 0) {
        var dataTag = resData.emit[0]
        var dataInfo = resData.emit[1]
        if (common.isUndefined(dataInfo) || common.isUndefined(dataInfo.id)) {
          log.warn('[APIServer] receive invalid data: ', dataInfo)
          return
        }
        switch (dataTag) {
          case 'hello':
            // data format: {id:xx, info:{}, stats:{}, block:{}}
            log.debug('[APIServer] message[hello]: ', dataInfo)
            // get node geoinfo by IP
            var req = http.get('http://www.geoplugin.net/json.gp?ip=' + clientIp, (res) => {
              var size = 0
              var chunks = []
              res.on('data', function (chunk) {
                size += chunk.length
                chunks.push(chunk)
              })
              res.on('end', function () {
                var data = Buffer.concat(chunks, size)
                var geoData = JSON.parse(data.toString())
                if (!common.isUndefined(geoData) && !common.isUndefined(geoData.geoplugin_status) &&
                              geoData.geoplugin_status === 200) {
                  dataInfo.geo = {
                    ip: clientIp,
                    status: geoData.geoplugin_status,
                    countryName: geoData.geoplugin_countryName,
                    countryCode: geoData.geoplugin_countryCode,
                    regionName: geoData.geoplugin_regionName,
                    regionCode: geoData.geoplugin_regionCode,
                    continentName: geoData.geoplugin_continentName,
                    continentCode: geoData.geoplugin_continentCode
                  }
                } else {
                  dataInfo.geo = {
                    ip: clientIp,
                    status: 400,
                    countryName: '',
                    countryCode: '',
                    regionName: '',
                    regionCode: '',
                    continentName: '',
                    continentCode: ''
                  }
                }
                log.debug('[APIServer] geo info: ', dataInfo.geo)
                funcHello(self, client, dataInfo)
              })
            })
            req.on('error', (e) => {
              log.error(`[APIServer] get geo info has problem with request: ${e.message}`)
            })
            req.end()
            break
          case 'node-ping':
            // ping data format: {tag: 'stats', message:{id:xx, clientTime:xx}}
            // pong data format: {id:xx, clientTime:xx, serverTime: xx}
            log.debug('[APIServer] message[node-ping]: ', dataInfo)
            funcNodePing(self, client, dataInfo)
            break
          case 'stats':
            // data format: {tag: 'stats', message: {id:xx, stats:{}} }
            log.debug('[APIServer] message[stats]: ', dataInfo)
            funcNodeStats(self, client, dataInfo)
            break
          case 'block':
            // data format: {tag: 'block', message: {id:xx, block:{}} }
            log.debug('[APIServer] message[block]: ', dataInfo)
            funcNodeBlock(self, client, dataInfo)
            break
          case 'latency':
            // data format: {tag: 'latency', message: {id:xx, latency:{}} }
            log.debug('[APIServer] message[latency]: ', dataInfo)
            funcNodeLatency(self, client, dataInfo)
            break
        }
      }
    })

    client.on('error', function error (err) {
      log.error('[APIServer] do process error event, error: ', err)
    })

    client.on('close', function (code, reason) {
      log.warn('[APIServer] client disconnect,code: ', code, ' reason: ', reason)
    })

    // ----------------------------------------------------------------
    // Event process function：process hello event
    var funcHello = function (server, client, data) {
      log.info('[APIServer] process: client hello.')

      // TODO: check access right
      if (common.isUndefined(data) || common.isUndefined(data.info)) {
        log.error('[APIServer] hello: node info is null.')
        // TODO: more times check
        // client.end(undefined, { reconnect: true });
        return false
      }
      // update clientStat timestamp
      var stateIndex = common.findIndex(server.clientStateList, {id: data.id})
      if (stateIndex < 0) {
        server.clientStateList.push({id: data.id, timestamp: common.now()})
      } else {
        server.clientStateList[stateIndex].timestamp = common.now()
      }      
      // process data and write
      if (data.info.netVersion === 1) {
        server.monitorDataMain.addData(data, function (err) {
          if (err !== null) {
            log.error('[APIServer] hello: add data error:', err)
            // client.end(undefined, { reconnect: true });
            return false
          }
          log.debug('[APIServer] hello: add data success.')
        })
      } else {
        server.monitorDataTest.addData(data, function (err) {
          if (err !== null) {
            log.error('[APIServer] hello: add data error:', err)
            // client.end(undefined, { reconnect: true });
            return false
          }
          log.debug('[APIServer] hello: add data success.')
        })
      }
    }

    // Event process function: process nodeStats event
    var funcNodeStats = function (server, client, data) {
      log.info('[APIServer] process: client stats.')

      if (common.isUndefined(data) || common.isUndefined(data.id) || common.isUndefined(data.stats)) {
        log.error('[APIServer] stats: node stats is null.')
        return false
      }
      // find node info by node id
      var nodeIndex = server.monitorDataMain.nodeList.findIndex({id: data.id})
      var mainExistFlag = 0
      var testExistFlag = 0
      if (nodeIndex < 0) {
        mainExistFlag = 0
        nodeIndex = server.monitorDataTest.nodeList.findIndex({id: data.id})
        if (nodeIndex < 0) {
          testExistFlag = 0
          return false
        } else {
          testExistFlag = 1
        }
      } else {
        mainExistFlag = 1
      }
      // process node.stats and write
      if (mainExistFlag === 1) {
        server.monitorDataMain.updateNodeStats(data, function (err) {
          if (err !== null) {
            log.error('[APIServer] stats: update node stats error:', err)
            return false
          }
          log.debug('[APIServer] stats: update node stats  success.')
        })
      } else if (testExistFlag === 1) {
        server.monitorDataTest.updateNodeStats(data, function (err) {
          if (err !== null) {
            log.error('[APIServer] stats: update node stats error:', err)
            return false
          }
          log.debug('[APIServer] stats: update node stats  success.')
        })
      }
    }

    // Event process function: process nodeblock event
    var funcNodeBlock = function (server, client, data) {
      log.info('[APIServer] process: client block.')

      if (common.isUndefined(data) || common.isUndefined(data.id) || common.isUndefined(data.block)) {
        log.error('[APIServer] block: node block is null.')
        return false
      }
      // find node info by node id
      var nodeIndex = server.monitorDataMain.nodeList.findIndex({id: data.id})
      var mainExistFlag = 0
      var testExistFlag = 0
      if (nodeIndex < 0) {
        mainExistFlag = 0
        nodeIndex = server.monitorDataTest.nodeList.findIndex({id: data.id})
        if (nodeIndex < 0) {
          testExistFlag = 0
          return false
        } else {
          testExistFlag = 1
        }
      } else {
        mainExistFlag = 1
      }
      // process node.block and write
      if (mainExistFlag === 1) {
        server.monitorDataMain.updateNodeBlock(data, function (err) {
          if (err !== null) {
            log.error('[APIServer] block: update node block error:', err)
            return false
          }
          log.debug('[APIServer] block: update node block success.')
        })
      } else if (testExistFlag === 1) {
        server.monitorDataTest.updateNodeBlock(data, function (err) {
          if (err !== null) {
            log.error('[APIServer] block: update node block error:', err)
            return false
          }
          log.debug('[APIServer] block: update node block success.')
        })
      }
    }

    // Event process function: process nodePing event
    var funcNodePing = function (server, client, data) {
      log.info('[APIServer] process: client node-ping.')
      var pingResData
      if (common.isUndefined(data)) {
        log.error('[APIServer] node-ping: data is null')
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
        'emit': [
          'node-pong',
          pingResData
        ]
      }
      // update clientStat timestamp
      var stateIndex = common.findIndex(server.clientStateList, {id: data.id})
      if (stateIndex < 0) {
        server.clientStateList.push({id: data.id, timestamp: common.now()})
      } else {
        server.clientStateList[stateIndex].timestamp = common.now()
      }
      client.send(JSON.stringify(pingResData))
      log.debug('node-pong data:', pingResData)
    }

    // Event process function: process nodelatency event
    var funcNodeLatency = function (server, client, data) {
      log.info('[APIServer] process: client latency.')
      if (common.isUndefined(data) || common.isUndefined(data.id) || common.isUndefined(data.latency)) {
        log.error('[APIServer] latency: data is null')
        return false
      }
      log.debug('latency data:', data)

      // find node info by node id
      var nodeIndex = server.monitorDataMain.nodeList.findIndex({id: data.id})
      var mainExistFlag = 0
      var testExistFlag = 0
      if (nodeIndex < 0) {
        mainExistFlag = 0
        nodeIndex = server.monitorDataTest.nodeList.findIndex({id: data.id})
        if (nodeIndex < 0) {
          testExistFlag = 0
          return false
        } else {
          testExistFlag = 1
        }
      } else {
        mainExistFlag = 1
      }
      // process node.block and write
      if (mainExistFlag === 1) {
        server.monitorDataMain.updateNodeLatency(data, function (err) {
          if (err !== null) {
            log.error('[APIServer] latency: update node latency error:', err)
            return false
          }
          log.debug('[APIServer] latency: update node latency success.')
        })
      } else if (testExistFlag === 1) {
        server.monitorDataTest.updateNodeLatency(data, function (err) {
          if (err !== null) {
            log.error('[APIServer] latency: update node latency error:', err)
            return false
          }
          log.debug('[APIServer] latency: update node latency success.')
        })
      }
    }
  })

  // interval: auto check client offline and update node active false
  var clientConnTimeout = process.env.WS_CLIENT_CONN_TIMEOUT || 15
  var clientConnInterval = process.env.WS_CLIENT_CONN_INTERVAL || 30000
  log.debug('clientConnTimeout: ', clientConnTimeout, ' clientConnInterval: ', clientConnInterval)
  setInterval(function () {
    var clientState = {}
    for (var i = 0; i < self.clientStateList.length; i++) {
      clientState = self.clientStateList[i]
      if (common.isUndefined(clientState) || common.isUndefined(clientState.id)) {
        continue
      }
      if ((common.now() - self.clientStateList[i].timestamp) / 1000 >= clientConnTimeout) {
        funcNodeStatsRealTime(self, self.api_client, self.clientStateList[i].id, false)
      }
    }
  }, clientConnInterval)

  // Event process function: process nodeStatsRealTime event
  var funcNodeStatsRealTime = function (server, client, nodeId, statFlag) {
    if (common.isUndefined(nodeId)) {
      log.error('[APIServer] state offline: nodeId is null.')
      return
    }
    var nodeInfo = {}
    var nodeState = {}
    // find node info by node id
    var nodeIndex = server.monitorDataMain.nodeList.findIndex({id: nodeId})
    var mainExistFlag = 0
    var testExistFlag = 0
    if (nodeIndex < 0) {
      mainExistFlag = 0
      nodeIndex = server.monitorDataTest.nodeList.findIndex({id: nodeId})
      if (nodeIndex < 0) {
        testExistFlag = 0
        return false
      } else {
        testExistFlag = 1
        nodeInfo = common.cloneDeep(server.monitorDataTest.nodeList.nodeItems[nodeIndex])
      }
    } else {
      mainExistFlag = 1
      nodeInfo = common.cloneDeep(server.monitorDataMain.nodeList.nodeItems[nodeIndex])
    }
    if (common.isUndefined(nodeInfo) || common.isUndefined(nodeInfo.stats)) {
      return
    }
    nodeState = {
      id: nodeId,
      stats: nodeInfo.stats
    }
    nodeState.stats.active = statFlag
    // process node.stats and write
    if (mainExistFlag === 1) {
      server.monitorDataMain.updateNodeStats(nodeState, function (err) {
        if (err !== null) {
          log.error('[APIServer] stats: update node stats error:', err)
          return false
        }
        log.debug('[APIServer] stats: update node stats  success.')
      })
    } else if (testExistFlag === 1) {
      server.monitorDataTest.updateNodeStats(nodeState, function (err) {
        if (err !== null) {
          log.error('[APIServer] stats: update node stats error:', err)
          return false
        }
        log.debug('[APIServer] stats: update node stats  success.')
      })
    }
  }
}

module.exports = ApiServer
