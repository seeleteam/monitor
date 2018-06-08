var common = require('lodash')
var MonitorError = require('./MonitorError')

/**
 * @class BowerNode
 * @param {object} monitorNode node struct in MonitorData
 * @classdesc Node struct for bowerData
 * @desc
 */
var BowerNode = function BowerNode (monitorNode) {
  this.nodeId = null
  this.nodeName = null
  this.nodeType = null
  this.state = 0
  this.nodeIsMining = 0
  this.nodePeers = 0
  this.nodeLastBlock = 0
  this.nodeLastBlockTime = common.now()
  this.nodeLatency = 0
  this.nodeDifficulty = 0
  this.nodeTxcount = 0

  this.nodeInfo = {}
  this.nodeGeo = {}

  this.transferNode(monitorNode)
  return this
}

/**
 * @method transferNode
 * @param {object} monitorNode node struct in MonitorData
 * @returns {object} bowerNode in BowerData
 * @desc bowerNode init from Monitor Node
 */
BowerNode.prototype.transferNode = function (monitorNode) {
  if (common.isUndefined(monitorNode)) {
    return this.getNode()
  }

  this.nodeId = monitorNode.id
  this.state = monitorNode.stats.active ? 1 : 0
  this.nodeName = monitorNode.info.name
  this.nodeType = monitorNode.info.netVersion + '/' + monitorNode.info.shard + '/' + monitorNode.info.protocol +
       '/' + monitorNode.info.os + '/' + monitorNode.info.os_v
  this.nodeIsMining = monitorNode.stats.mining
  this.nodePeers = monitorNode.stats.peers
  this.nodeLastBlock = monitorNode.block.height
  this.nodeLastBlockTime = monitorNode.block.arrived
  this.nodeLatency = monitorNode.stats.latency
  this.nodeDifficulty = monitorNode.block.difficulty
  this.nodeTxcount = monitorNode.block.txcount

  this.nodeInfo = monitorNode.info
  this.nodeGeo = monitorNode.geo
  return this.getNode()
}

/**
 * @method compareNode
 * @param {object} oldNode
 * @returns {bool}
 * @desc compare bowerNode info
 */
BowerNode.prototype.compareNode = function (oldNode) {
  if (common.isUndefined(oldNode)) {
    return true
  }
  if (this.nodeId !== oldNode.nodeId ||
        this.nodeName !== oldNode.nodeName ||
        this.nodeType !== oldNode.nodeType ||
        this.state !== oldNode.state ||
        this.nodeIsMining !== oldNode.nodeIsMining ||
        this.nodePeers !== oldNode.nodePeers ||
        this.nodeLastBlock !== oldNode.nodeLastBlock ||
        this.nodeLatency !== oldNode.nodeLatency ||
        this.hasDiffNodeInfo(this.nodeInfo, oldNode.nodeInfo) ||
        this.hasDiffNodeGeo(this.nodeGeo, oldNode.nodeGeo)) {
    return true
  }
  return false
}

/**
 * @method getNode
 * @returns {object} bowerNode info
 * @desc get bowerNode info
 */
BowerNode.prototype.getNode = function () {
  return {
    nodeId: this.nodeId,
    nodeName: this.nodeName,
    nodeType: this.nodeType,
    state: this.state,
    nodeIsMining: this.nodeIsMining,
    nodePeers: this.nodePeers,
    nodeLastBlock: this.nodeLastBlock,
    nodeLastBlockTime: this.nodeLastBlockTime,
    nodeLatency: this.nodeLatency,
    nodeDifficulty: this.nodeDifficulty,
    nodeTxcount: this.nodeTxcount,
    nodeInfo: this.nodeInfo,
    nodeGeo: this.nodeGeo
  }
}

/**
 * @method hasDiffNodeInfo
 * @param {object} newInfo
 * @param {object} oldInfo
 * @returns {bool}
 * @desc compare nodeInfo, check if has diff
 */
BowerNode.prototype.hasDiffNodeInfo = function (newInfo, oldInfo) {
  if (common.isUndefined(newInfo)) {
    return false
  }
  if (common.isUndefined(oldInfo)) {
    return true
  }
  if (newInfo.name !== oldInfo.name ||
        newInfo.os !== oldInfo.os ||
        newInfo.os_v !== oldInfo.os_v ||
        newInfo.client !== oldInfo.client ||
        newInfo.netVersion !== oldInfo.netVersion ||
        newInfo.shard !== oldInfo.shard ||        
        newInfo.protocol !== oldInfo.protocol ||
        newInfo.api !== oldInfo.api ||
        newInfo.port !== oldInfo.port ||
        newInfo.canUpdateHistory !== oldInfo.canUpdateHistory ||
        newInfo.node !== oldInfo.node) {
    return true
  }

  return false
}

/**
 * @method hasDiffNodeGeo
 * @param {object} newGeo
 * @param {object} oldGeo
 * @returns {bool}
 * @desc compare nodeGeo, check if has diff
 */
BowerNode.prototype.hasDiffNodeGeo = function (newGeo, oldGeo) {
  if (common.isUndefined(newGeo)) {
    return false
  }
  if (common.isUndefined(oldGeo)) {
    return true
  }
  if (newGeo.ip !== oldGeo.ip ||
        newGeo.status !== oldGeo.status ||
        newGeo.countryName !== oldGeo.countryName ||
        newGeo.countryCode !== oldGeo.countryCode ||
        newGeo.regionName !== oldGeo.regionName ||
        newGeo.regionCode !== oldGeo.regionCode ||
        newGeo.continentName !== oldGeo.continentName ||
        newGeo.continentCode !== oldGeo.continentCode) {
    return true
  }

  return false
}

module.exports = BowerNode
