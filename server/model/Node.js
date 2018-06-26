var log = require('log4js').getLogger('model/Node')
var common = require('lodash')
// var MonitorError = require('./MonitorError')

/**
 * @class Node
 * @param {object} data
 * @classdesc data saved node info
 * @desc
 */
var Node = function Node (data) {
  this.id = null
  this.geo = {
    ip: null,
    status: 200,
    countryName: null,
    countryCode: null,
    regionName: null,
    regionCode: null,
    continentName: null,
    continentCode: null
  }
  this.type = null
  this.info = {
    name: null,
    os: null,
    os_v: null,
    client: null,
    netVersion: null,
    shard: null,
    protocol: null,
    api: null,
    port: null,
    canUpdateHistory: true,
    node: null
    // TODO add
    // contract: null,
    // coinbase: null,
  }
  this.stats = {
    active: false,
    mining: false,
    syncing: false,
    peers: 0,
    latency: 0
    // TODO  add
    // pending: 0,
    // hashrate: 0,
    // gasPrice: 0,
    // propagationAvg: 0,
    // uptime: 0,
  }
  this.block = {
    height: 0,
    timestamp: 0,
    difficulty: 0,
    txcount: 0,
    miners: null,
    // middle property
    arrived: 0,
    blockTime: 0,
    lastHeight: 0
    // TODO add
    // gasSpending: 0,
    // gasLimit: 0,
    // propagation: null,
    // uncles: null,
    // uncleCount: null,
  }

  return this
}

/**
 * @method filterNode
 * @param {object} newData data which is being filterred
 * @param {object} oldData data which is exist
 * @returns {object} node data after filter <br/>
 * ex: {
 *   updateFlag:0,  //node info if being updated
 *   data: {        //the data after filter
 *    id:xx, stats:xx, block:xx}
 *   }
 * @desc do process as follows: format data, check if update
 */
Node.prototype.filterNode = function (newData, oldData) {
  var resData = {
    updateFlag: 0,
    data: {}
  }
  log.debug('[Node] filterNode: ', newData)

  if (common.isUndefined(newData) || newData === null) {
    return resData
  }
  if (common.isUndefined(oldData) || oldData === null) {
    return {
      updateFlag: 1,
      data: newData
    }
  }
  resData.data.id = newData.id
  // node.geo
  var resGeoData = this.filterNodeGeo(newData.geo, oldData.geo)
  if (resGeoData.updateFlag) {
    resData.updateFlag = 1
  }
  resData.data.geo = resGeoData.data
  // node.info
  var resInfoData = this.filterNodeInfo(newData.info, oldData.info)
  if (resInfoData.updateFlag) {
    resData.updateFlag = 1
  }
  resData.data.info = resInfoData.data
  // node.stats
  var resStatData = this.filterNodeStats(newData.stats, oldData.stats)
  if (resStatData.updateFlag) {
    resData.updateFlag = 1
  }
  resData.data.stats = resStatData.data
  // node.block
  var resBlockData = this.filterNodeBlocks(newData.block, oldData.block)
  if (resBlockData.updateFlag) {
    resData.updateFlag = 1
  }
  resData.data.block = resBlockData.data
  // node.latency
  if (!common.isUndefined(newData.latency)) {
    resData.updateFlag = 1
  }
  resData.data.stats.latency = newData.latency

  return resData
}

/**
 * @method filterNode
 * @param {object} newData data which is being filterred
 * @param {object} oldData data which is exist
 * @returns  {object} node geo data after filter <br/>
 * ex: {
 *   updateFlag:0,    //node geo if being updated
 *   data:{ node geo }//the data after filter
 * }
 * @desc do process as follows: format nodeGeo, check if update
 */
Node.prototype.filterNodeGeo = function (newData, oldData) {
  var resData = {
    updateFlag: 0,
    data: {}
  }
  if (common.isUndefined(newData) || newData === null) {
    return resData
  }
  if (common.isUndefined(oldData) || oldData === null) {
    return {
      updateFlag: 1,
      data: newData
    }
  }
  if (newData.ip !== oldData.ip ||
        newData.status !== oldData.status ||
        newData.countryName !== oldData.countryName ||
        newData.countryCode !== oldData.countryCode ||
        newData.regionName !== oldData.regionName ||
        newData.regionCode !== oldData.regionCode ||
        newData.continentName !== oldData.continentName ||
        newData.continentCode !== oldData.continentCode) {
    resData.updateFlag = 1
    resData.data = newData
  }

  return resData
}

/**
 * @method filterNodeStats
 * @param {object} newData data which is being filterred
 * @param {object} oldData data which is exist
 * @returns {object} node info data after filter <br/>
 * ex: {
 *   updateFlag:0,  //node info if being updated
 *   data: {        //the data after filter
 *    node indo}
 *   }
 * @desc do process as follows: format nodeInfo, check if update
 */
Node.prototype.filterNodeInfo = function (newData, oldData) {
  var resData = {
    updateFlag: 0,
    data: {}
  }
  if (common.isUndefined(newData) || newData == null) {
    return resData
  }
  if (common.isUndefined(oldData) || oldData == null) {
    return {
      updateFlag: 1,
      data: newData
    }
  }

  if (newData.name !== oldData.name ||
        newData.os !== oldData.os ||
        newData.os_v !== oldData.os_v ||
        newData.client !== oldData.client ||
        newData.netVersion !== oldData.netVersion ||
        newData.shard !== oldData.shard ||
        newData.protocol !== oldData.protocol ||
        newData.api !== oldData.api ||
        newData.node !== oldData.node ||
        newData.port !== oldData.port) {
    resData.updateFlag = 1
    resData.data = newData
  }

  return resData
}

/**
 * @method filterNodeStats
 * @param {object} newData data which is being filterred
 * @param {object} oldData data which is exist
 * @returns {object} node stats data after filter <br/>
 * ex: {
 *   updateFlag:0,  //node info if being updated
 *   data: {        //the data after filter
 *    node stats}
 *   }
 * @desc do process as follows: format nodeStats, check if update
 */
Node.prototype.filterNodeStats = function (newData, oldData) {
  var resData = {
    updateFlag: 0,
    data: {}
  }
  log.debug('[Node] filterNodeStats oldData: ', oldData, ' newData: ', newData)
  if (common.isUndefined(newData) || newData === null) {
    return resData
  }
  if (common.isUndefined(oldData) || oldData === null) {
    return {
      updateFlag: 1,
      data: newData
    }
  }

  if (newData.active !== oldData.active ||
        newData.mining !== oldData.mining ||
        newData.syncing !== oldData.syncing ||
        newData.peers !== oldData.peers) {
    resData.updateFlag = 1
    resData.data = newData
  }
  return resData
}

/**
 * @method filterNodeLatency
 * @param {object} newData data which is being filterred
 * @param {object} oldData data which is exist
 * @returns {object} node latency data after filter <br/>
 * ex: {
 *   updateFlag:0,  //node info if being updated
 *   data: {        //the data after filter
 *    latency: xx}
 *   }
 * @desc do process as follows: format nodeLatency, check if update
 */
Node.prototype.filterNodeLatency = function (newData, oldData) {
  var resData = {
    updateFlag: 0,
    data: {}
  }
  log.debug('[Node] filterNodeLatency, oldData: ', oldData, ' newData: ', newData)
  if (common.isUndefined(newData) || newData == null) {
    return resData
  }
  if (common.isUndefined(oldData) || oldData == null) {
    return {
      updateFlag: 1,
      data: newData
    }
  }

  if (newData !== oldData) {
    resData.updateFlag = 1
    resData.data = newData
  }
  return resData
}

/**
 * @method filterNodeBlocks
 * @param {object} newData data which is being filterred
 * @param {object} oldData data which is exist
 * @returns {object} node block data after filter <br/>
 * ex: {
 *   updateFlag:0,  //node info if being updated
 *   data: {        //the data after filter
 *    node block}
 *   }
 * @desc do process as follows: format nodeBlocks, check if update
 */
Node.prototype.filterNodeBlocks = function (newData, oldData) {
  var resData = {
    updateFlag: 0,
    data: {}
  }
  log.debug('[Node] filterNodeBlocks oldData: ', oldData, ' newData: ', newData)
  if (common.isUndefined(newData) || newData == null) {
    return resData
  }
  if (common.isUndefined(oldData) || oldData == null) {
    return {
      updateFlag: 1,
      data: newData
    }
  }

  if (newData.height !== oldData.height ||
        newData.timestamp !== oldData.timestamp ||
        newData.difficulty !== oldData.difficulty ||
        newData.txcount !== oldData.txcount ||
        newData.gasSpending !== oldData.gasSpending ||
        newData.gasLimit !== oldData.gasLimit ||
        newData.miners !== oldData.miners ||
        newData.avgBlocktime !== oldData.avgBlocktime ||
        newData.avgHashrate !== oldData.avgHashrate) {
    resData.updateFlag = 1
    // bak last block
    var tmpLastHeight = oldData.height

    // update new block
    resData.data = newData

    // set last block
    resData.data.lastHeight = tmpLastHeight
  }

  return resData
}

module.exports = Node
