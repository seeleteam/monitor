var log = require('log4js').getLogger('model/MonitorData')
var NodeList = require('./NodeList')
var BlockList = require('./BlockList')
var common = require('lodash')
var MonitorError = require('./MonitorError')
var Node = require('./Node')

/**
 * @class MonitorData
 * @classdesc seele-monitor server data which is from api webscoket and support to bowerData
 * @desc
 */
var MonitorData = function MonitorData () {
  /**
   * @member {NodeList}
   * @desc node data list
   */
  this.nodeList = new NodeList()
  /**
   * @member {BlockList}
   * @desc block data list
   */
  this.blockList = new BlockList()

  this.highestBlock = 0
  /**
   * @member {bool}
   * @desc monitor data update flag, when is true, the monitor html will refresh
   */
  this.monitorUpdateFlag = false
  return this
}

/**
 * @method printData
 * @desc print the monitor data value
 */
MonitorData.prototype.printData = function () {
  log.debug('[MonitorData] =======================================')
  log.debug('[MonitorData] current Monitor:')
  log.debug('[MonitorData]   nodeList: ')
  this.nodeList.printAll()
  log.debug('[MonitorData]   blockList: ')
  this.blockList.printAll()
  log.debug('[MonitorData]   monitorUpdateFlag: ', this.monitorUpdateFlag)
}

/**
 * @method addData
 * @param {object} data node data object <br/>
 * ex: {id:xx, info:{}, latency:xxx, stats:{}, block{}}
 * @param {function} callback
 * @desc add or update node data, if not exist to add ,otherwise to update
 */
MonitorData.prototype.addData = function (data, callback) {
  var err = null
  log.debug('[MonitorData] addData:', data)

  if (common.isUndefined(data) || data === null || common.isUndefined(data.id)) {
    err = new MonitorError('data is null!')
  } else {
    // add nodeList
    var filterResult = this.filterData('all', data, null)
    if (common.isUndefined(filterResult)) {
      err = new MonitorError('data invalid!')
    } else if (filterResult.existFlag && !filterResult.updateFlag) {
      return
    } else if (!filterResult.existFlag) {
      this.monitorUpdateFlag = true
      var resData = {}
      resData.id = filterResult.data.id
      resData.geo = filterResult.data.geo
      resData.info = filterResult.data.info
      resData.stats = filterResult.data.stats
      resData.block = filterResult.data.block
      resData.block.arrived = common.now()
      resData.block.blockTime = 0
      resData.stats.latency = filterResult.data.latency

      this.nodeList.nodeItems.push(resData)
    } else if(filterResult.existFlag && filterResult.updateFlag) {
      this.monitorUpdateFlag = true
      var resData = common.cloneDeep(data)
      if (!common.isUndefined(filterResult.data.geo) && !common.isUndefined(filterResult.data.geo.ip)) {
        resData.geo = filterResult.data.geo
      }
      if (!common.isUndefined(filterResult.data.info) && !common.isUndefined(filterResult.data.info.name)) {
        resData.info = filterResult.data.info
      }
      if (!common.isUndefined(filterResult.data.stats) && !common.isUndefined(filterResult.data.stats.active)) {
        resData.stats = filterResult.data.stats
      } 
      if (!common.isUndefined(filterResult.data.block) && !common.isUndefined(filterResult.data.block.height)) {
        resData.block = filterResult.data.block
      } 
      if (!common.isUndefined(filterResult.data.latency)) {
        resData.stats.latency = filterResult.data.latency
      }
      this.nodeList.nodeItems[filterResult.index] = resData
    }
    // add blockList
    if (!common.isUndefined(data.block)) {
      this.addNodeBlock(data, callback)
    }
  }

  log.debug('[MonitorData] after addData: ')
  this.printData()

  if (!common.isUndefined(callback) && callback !== null) {
    callback(err)
  }
}
/**
 * @method addNodeBlock
 * @param {object} data node block data object <br/>
 * ex: {id:xx, block{}}
 * @param {function} callback
 * @desc add node block data, if exist to update
 */
MonitorData.prototype.addNodeBlock = function (data, callback) {
  var err = null

  log.debug('[MonitorData] addNodeBlock: ', data)
  if (common.isUndefined(data) || common.isUndefined(data.id) || common.isUndefined(data.block)) {
    err = new MonitorError('data is null!')
  } else {
    // add blockList
    var addResult = this.blockList.addData(data.block)
    if (addResult) {
      this.monitorUpdateFlag = true
    }
  }

  log.debug('[MonitorData] after addNodeBlock: ')
  this.printData()

  if (!common.isUndefined(callback) && callback !== null) {
    callback(err)
  }
}

/**
 * @method updateData
 * @param {object} data node data object <br/>
 * ex: {id:xx, info:{}, stats:{}, block{}}
 * @param {function} callback
 * @desc update node data, if exist to update
 */
MonitorData.prototype.updateData = function (data, callback) {
  var err = null

  log.debug('[MonitorData] updateData: ', data)
  if (common.isUndefined(data) || data === null) {
    err = new MonitorError('data is null!')
  } else {
    var filterResult = this.filterData('all', data, null)
    log.debug('[MonitorData] filterData result: ', filterResult)
    if (common.isUndefined(filterResult)) {
      err = new MonitorError('data invalid!')
    } else if (filterResult.existFlag && filterResult.updateFlag) {
      this.monitorUpdateFlag = true
      var resData = common.cloneDeep(data)
      if (!common.isUndefined(filterResult.data.geo) && !common.isUndefined(filterResult.data.geo.ip)) {
        resData.geo = filterResult.data.geo
      }
      if (!common.isUndefined(filterResult.data.info) && !common.isUndefined(filterResult.data.info.name)) {
        resData.info = filterResult.data.info
      }
      if (!common.isUndefined(filterResult.data.stats) && !common.isUndefined(filterResult.data.stats.active)) {
        resData.stats = filterResult.data.stats
      } 
      if (!common.isUndefined(filterResult.data.block) && !common.isUndefined(filterResult.data.block.height)) {
        resData.block = filterResult.data.block
      }
      if (!common.isUndefined(filterResult.data.latency)) {
        resData.stats.latency = filterResult.data.latency
      }
      
      this.nodeList.nodeItems[filterResult.index] = resData
    }
  }

  log.debug('[MonitorData] after updateData: ')
  this.printData()

  if (!common.isUndefined(callback) && callback !== null) {
    callback(err)
  }
}

/**
 * @method updateNodeStats
 * @param {object} data node stats data object <br/>
 * ex:{id:xxx, stats:{xxxx}}
 * @param {function} callback
 * @desc update node stats data, if exist to update
 */
MonitorData.prototype.updateNodeStats = function (data, callback) {
  var err = null

  log.debug('[MonitorData] updateNodeStats: ', data)
  if (common.isUndefined(data) || common.isUndefined(data.id) || common.isUndefined(data.stats)) {
    err = new MonitorError('data is null!')
  } else {
    var filterResult = this.filterData('stats', data, null)
    log.debug('[MonitorData] filterData result: ', filterResult)
    if (common.isUndefined(filterResult) || common.isUndefined(filterResult.data)) {
      err = new MonitorError('data invalid!')
    } else if (this.nodeList.nodeItems[filterResult.index] &&
            !common.isUndefined(this.nodeList.nodeItems[filterResult.index].stats) &&
            this.nodeList.nodeItems[filterResult.index].stats !== null && filterResult.updateFlag) {
      this.monitorUpdateFlag = true
      var originLatency = this.nodeList.nodeItems[filterResult.index].stats.latency
      this.nodeList.nodeItems[filterResult.index].stats = filterResult.data.stats
      this.nodeList.nodeItems[filterResult.index].stats.latency = originLatency
    }
  }
  log.debug('[MonitorData] after updateNodeStats: ')
  this.printData()

  if (!common.isUndefined(callback) && callback !== null) {
    callback(err)
  }
}

/**
 * @method updateNodeLatency
 * @param {object} data node latency data object <br/>
 * ex:{id:xxx, latency:xxxx}
 * @param {function} callback
 * @desc update node stats data, if exist to update
 */
MonitorData.prototype.updateNodeLatency = function (data, callback) {
  var err = null

  log.debug('[MonitorData] updateNodeLatency: ', data)
  if (common.isUndefined(data) || common.isUndefined(data.id) || common.isUndefined(data.latency)) {
    err = new MonitorError('data is null!')
  } else {
    var filterResult = this.filterData('latency', data, null)
    log.debug('[MonitorData] filterData result: ', filterResult)
    if (common.isUndefined(filterResult) || common.isUndefined(filterResult.data)) {
      err = new MonitorError('data invalid!')
    } else if (!common.isUndefined(this.nodeList.nodeItems[filterResult.index]) &&
           !common.isUndefined(this.nodeList.nodeItems[filterResult.index].stats) &&
           this.nodeList.nodeItems[filterResult.index].stats !== null &&
           filterResult.updateFlag) {
      this.monitorUpdateFlag = true
      this.nodeList.nodeItems[filterResult.index].stats.latency = filterResult.data.stats.latency
    }
  }

  log.debug('[MonitorData] after updateNodeLatency: ')
  this.printData()

  if (!common.isUndefined(callback) && callback !== null) {
    callback(err)
  }
}

/**
 * @method updateNodeBlock
 * @param {object} data node block data object <br/>
 * ex: {id:xxx, block:{xxxx}}
 * @param {function} callback
 * @desc update node block data, if exist to update
 */
MonitorData.prototype.updateNodeBlock = function (data, callback) {
  var err = null

  log.debug('[MonitorData] updateNodeBlock: ', data)
  if (common.isUndefined(data) || common.isUndefined(data.id) || common.isUndefined(data.block)) {
    err = new MonitorError('data is null!')
  } else {
    // update node.block
    var filterResult = this.filterData('block', data, null)
    log.debug('[MonitorData] filterData result: ', filterResult)
    if (common.isUndefined(filterResult) || common.isUndefined(filterResult.data)) {
      err = new MonitorError('filter block result invalid!')
    } else if (!common.isUndefined(this.nodeList.nodeItems[filterResult.index]) &&
            !common.isUndefined(this.nodeList.nodeItems[filterResult.index].block) &&
            this.nodeList.nodeItems[filterResult.index].block !== null && filterResult.updateFlag) {
      this.monitorUpdateFlag = true
      this.nodeList.nodeItems[filterResult.index].block = filterResult.data.block
      this.nodeList.nodeItems[filterResult.index].block.arrived = common.now()
      this.nodeList.nodeItems[filterResult.index].block.blockTime = 0
    }
    // add blockList
    var addResult = this.blockList.addData(data.block)
    if (addResult) {
      this.monitorUpdateFlag = true
    }
  }

  log.debug('[MonitorData] after updateNodeBlock: ')
  this.printData()

  if (!common.isUndefined(callback) && callback !== null) {
    callback(err)
  }
}

/**
 * @method filterData
 * @param {string } tag tag for the update data
 * ex: [all, stats, block]
 * @param {object} data node block data object <br/>
 * ex: {id:xx, info:xxx, stats:xxx, block:xxx}
 * @param {function} callback
 * @returns {object}
 * ex:{
 *         index:0,      data index in this.nodeList
 *         existFlag:0,  if exist in this.nodeList
 *         updateFlag:0, if update in this.nodeList
 *         data:{}       the data after filter
 *     }
 * @desc filter data from this.nodeList
 */
MonitorData.prototype.filterData = function (tag, data, callback) {
  var err = null
  var resData = {
    index: -1,
    existFlag: 0,
    updateFlag: 0,
    data: null
  }
  log.debug('[MonitorData] filterData[tag:', tag, ']:', data)

  if (common.isUndefined(data)) {
    err = new MonitorError('data is null!')
    return resData
  } else {
    var nodeIndex = this.nodeList.findIndex({id: data.id})
    if (nodeIndex >= 0) {
      switch (tag) {
        case 'all':
          resData.existFlag = 1
          resData.index = nodeIndex
          var afterAllData = new Node(null).filterNode(data, this.nodeList.nodeItems[nodeIndex])
          log.debug('[MonitorData] filter[all], afterAllData: ', afterAllData)
          resData.updateFlag = afterAllData.updateFlag
          resData.data = afterAllData.data
          break
        case 'stats':
          resData.existFlag = 1
          resData.index = nodeIndex
          var afterStatsData = new Node(null).filterNodeStats(data.stats, this.nodeList.nodeItems[nodeIndex].stats)
          log.debug('[MonitorData] filter[stats], afterStatsData: ', afterStatsData)
          resData.updateFlag = afterStatsData.updateFlag
          if (afterStatsData.updateFlag === 1) {
            this.nodeList.nodeItems[nodeIndex].stats = afterStatsData.data
            resData.data = this.nodeList.nodeItems[nodeIndex]
          }
          break
        case 'latency':
          resData.existFlag = 1
          resData.index = nodeIndex
          var afterLatencyData = new Node(null).filterNodeLatency(data.latency, this.nodeList.nodeItems[nodeIndex].stats.latency)
          log.debug('[MonitorData] filter[latency], afterLatencyData: ', afterLatencyData)
          resData.updateFlag = afterLatencyData.updateFlag
          if (afterLatencyData.updateFlag === 1) {
            this.nodeList.nodeItems[nodeIndex].stats.latency = afterLatencyData.data
            resData.data = this.nodeList.nodeItems[nodeIndex]
          }
          break
        case 'block':
          resData.existFlag = 1
          resData.index = nodeIndex
          var afterBlockData = new Node(null).filterNodeBlocks(data.block, this.nodeList.nodeItems[nodeIndex].block)
          log.debug('[MonitorData] filter[block], afterBlockData: ', afterBlockData)
          resData.updateFlag = afterBlockData.updateFlag
          if (afterBlockData.updateFlag === 1) {
            this.nodeList.nodeItems[nodeIndex].block = afterBlockData.data
            resData.data = this.nodeList.nodeItems[nodeIndex]
          }
          break
      }
    } else {
      resData.index = -1
      resData.existFlag = 0
      resData.updateFlag = 1
      resData.data = data
    }
  }
  log.debug('[MonitorData] after filterData: ', resData)

  if(!common.isUndefined(callback) && callback !== null){
      callback(err);
  }
  return resData
}

module.exports = MonitorData
