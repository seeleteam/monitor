var log = require('log4js').getLogger('model/BowerData')
var BowerNode = require('./BowerNode')
var common = require('lodash')
var MonitorError = require('./MonitorError')

/**
 * @class BowerData
 * @classdesc seele-monitor server data which is from monitorData and support to front bower
 * @desc
 */
var BowerData = function BowerData () {
  this.bestBlockInfo = {}
  // bower display item
  this.bestBlock = 0
  this.lastBlock = common.now()
  this.avgBlockTime = 0
  this.activeNodes = 0
  this.totalNodes = 0
  this.avgNetHashRate = 0
  this.totalTransactions = 0
  this.nodeItems = []
  this.statCharData = {
    height: [],
    txcount: [],
    difficulty: [],
    blocktime: []
  }

  // middle item
  this.oldBastBlockInfo = this.bestBlockInfo
  this.oldBestBlock = this.bestBlock
  this.oldLastBlock = this.lastBlock
  this.oldAvgBlockTime = this.avgBlockTime
  this.oldActiveNodes = this.activeNodes
  this.oldTotalNodes = this.totalNodes
  this.oldAvgNetHashRate = this.avgNetHashRate
  this.oldTotalTransactions = this.totalTransactions
  this.oldNodeItems = this.nodeItems
  this.oldStatCharData = this.statCharData

  // tag
  this.blockUpdateFlag = false
  this.nodeUpdateFlag = false

  return this
}

/**
 * @method transferToBowerData
 * @param {object} monitorData monitorData MonitorData: data from seele-monitor-api
 * @desc transfer data from MonitorData
 */
BowerData.prototype.transferToBowerData = function (monitorData) {
  log.debug('[BowerData] transferToBowerData: ', monitorData)
  this.oldBastBlockInfo = this.bestBlockInfo
  this.bestBlockInfo = this.calcBestBlock(monitorData)

  if (!common.isUndefined(this.bestBlockInfo) && !common.isUndefined(this.bestBlockInfo.block) &&
      !common.isUndefined(this.bestBlockInfo.block.height)) {
    var tmpBestBlock = this.bestBlockInfo.block.height
    if (this.bestBlock < tmpBestBlock) {
      this.oldBestBlock = this.bestBlock
      this.bestBlock = tmpBestBlock
      this.blockUpdateFlag = true
    }
  }
  var tmpLastBlock = this.calcLastBlock(monitorData)
  if (this.blockUpdateFlag) {
    this.oldLastBlock = this.lastBlock
    this.lastBlock = tmpLastBlock
  }
  var tmpAvgBlockTime = this.calcAvgBlockTime(monitorData)
  if (this.blockUpdateFlag) {
    this.oldAvgBlockTime = this.avgBlockTime
    this.avgBlockTime = tmpAvgBlockTime
  }
  var tmpAvgNetHashRate = this.calcAvgNetHashRate(this.bestBlockInfo, this.avgBlockTime)
  if (this.blockUpdateFlag) {
    this.oldAvgNetHashRate = this.avgNetHashRate
    this.avgNetHashRate = tmpAvgNetHashRate
  }

  var tmpTotalTransactions = this.calcTotalTransactions(monitorData)
  if (this.blockUpdateFlag) {
    this.oldTotalTransactions = this.totalTransactions
    this.totalTransactions = tmpTotalTransactions
  }

  var tmpStatCharData = this.calcStatCharData(monitorData)
  if (this.blockUpdateFlag) {
    this.oldStatCharData = this.statCharData
    this.statCharData = tmpStatCharData
  }

  var tmpActiveNodes = this.calcActiveNodes(monitorData)
  if (this.tmpActiveNodes !== tmpActiveNodes) {
    this.oldActiveNodes = this.activeNodes
    this.activeNodes = tmpActiveNodes
    this.nodeUpdateFlag = true
  }
  var tmpTotalNodes = this.calcTotalNodes(monitorData)
  if (this.totalNodes !== tmpTotalNodes) {
    this.oldTotalNodes = this.totalNodes
    this.totalNodes = tmpTotalNodes
    this.nodeUpdateFlag = true
  }

  var tmpNodeItems = this.calcNodeItems(monitorData)
  if (!common.isUndefined(common.differenceWith(this.nodeItems, tmpNodeItems, common.isEqual))) {
    this.nodeItems = tmpNodeItems
    this.nodeUpdateFlag = true
  }
  log.debug('[BowerData] bowerData: ', this.getBowerData())
}

/**
 * @method calcBestBlock
 * @param {object} monitorData monitorData MonitorData: data from seele-monitor-api
 * @returns {number} maxBlock
 * @desc calcuate the monitor item named BestBlock
 */
BowerData.prototype.calcBestBlock = function (monitorData) {
  var tmpBestBlock = {}
  // TODO
  if (common.isUndefined(monitorData.nodeList.nodeItems)) {
    return tmpBestBlock
  }
  if (monitorData.nodeList.nodeItems.length <= 0) {
    return tmpBestBlock
  }
  var maxBlock = common.maxBy(monitorData.nodeList.nodeItems, 'block.height')
  return maxBlock
}

/**
 * @method calcLastBlock
 * @param {object} monitorData monitorData MonitorData: data from seele-monitor-api
 * @returns {number} tmpBestBlockArrived
 * @desc calcuate the monitor item named LastBlock
 */
BowerData.prototype.calcLastBlock = function (monitorData) {
  var tmpBestBlockArrived = common.now()
  if (!common.isUndefined(this.bestBlockInfo) && !common.isUndefined(this.bestBlockInfo.block) &&
      !common.isUndefined(this.bestBlockInfo.block.arrived)) {
    tmpBestBlockArrived = this.bestBlockInfo.block.arrived
  }
  return tmpBestBlockArrived
}

/**
 * @method calcAvgBlockTime
 * @param {object} monitorData monitorData MonitorData: data from seele-monitor-api
 * @returns {number} tmpBestBlockArrived <br/>
 *  unit is ms, the result multi 1000 and then divide 1000 in display filter <br/>
 *  do it for json deal float as string
 * @desc calcuate the monitor item named AvgBlockTime </br>
 *       calcuate it by block.arrived
 */
BowerData.prototype.calcAvgBlockTime = function (monitorData) {
  var tmpAvgBlockTime = 0
  if (common.isUndefined(monitorData) || common.isUndefined(monitorData.blockList) || monitorData.blockList.blockItems.length === 0) {
    return tmpAvgBlockTime
  }

  var calcBlockItems = monitorData.blockList.blockItems
  if (calcBlockItems.length === 1) {
    // stat by the time of block arrived monitor
    // if (common.isUndefined(calcBlockItems[0].arrived)) {
    //   return tmpAvgBlockTime
    // } else {
    //   return common.now() - calcBlockItems[0].arrived
    // }
    if (common.isUndefined(calcBlockItems[0].timestamp)) {
      return tmpAvgBlockTime
    } else {
      if (String(calcBlockItems[0].timestamp).length < 13) {
        return common.now() - calcBlockItems[0].timestamp * 1000
      } else {
        return common.now() - calcBlockItems[0].timestamp
      }
    }
  }

  calcBlockItems = common.sortBy(calcBlockItems, 'height')
  var calcBlockNum = 0
  var calcBlockTimeSum = 0
  var preBlock, currentBlock
  for (var i = 1; i < calcBlockItems.length; i++) {
    preBlock = calcBlockItems[i - 1]
    currentBlock = calcBlockItems[i]
    if (currentBlock.height - preBlock.height !== 1) {
      continue
    }
    calcBlockNum++
    // calc by arrived
    // calcBlockTimeSum += currentBlock.arrived - preBlock.arrived
    if (String(currentBlock.timestamp).length < 13) { 
      calcBlockTimeSum += currentBlock.timestamp * 1000 - preBlock.timestamp * 1000
    } else {
      calcBlockTimeSum += currentBlock.timestamp - preBlock.timestamp
    }
  }
  if (calcBlockNum > 0) {
    tmpAvgBlockTime = calcBlockTimeSum / calcBlockNum
  }
  return tmpAvgBlockTime.toFixed(2) * 1000
}

/**
 * @method calcAvgNetHashRate
 * @param {object} bestBlockInfo
 * @param {number} avgBlockTime
 * @returns {number} tmpAvgNetHashRate <br/>
 *  unit is  H/s, the result multi 1000 and then divide 1000 in display filter <br/>
 *  do it for json deal float as string
 * @desc calcuate the monitor item named AvgNetHashRate </br>
 */
BowerData.prototype.calcAvgNetHashRate = function (bestBlockInfo, avgBlockTime) {
  var tmpAvgNetHashRate = 0
  if (common.isUndefined(bestBlockInfo) || common.isUndefined(bestBlockInfo.block.difficulty) || avgBlockTime <= 0) {
    return tmpAvgNetHashRate
  }

  var v_avgBlockTime = avgBlockTime / (1000 * 1000)
  tmpAvgNetHashRate = (bestBlockInfo.block.difficulty / v_avgBlockTime)

  return tmpAvgNetHashRate.toFixed(2) * 1000
}

/**
 * TODO
 * @method calcTotalTransactions
 * @param {object} bestBlockInfo
 * @param {number} avgBlockTime
 * @returns {number} tmpTotalTransactions <br/>
 * @desc calcuate the monitor item named TotalTransactions </br>
 */
BowerData.prototype.calcTotalTransactions = function (monitorData) {
  var tmpTotalTransactions = 0
  return tmpTotalTransactions
}

/**
 * @method calcStatCharData
 * @param {object} monitorData
 * @returns {object} tmpStatCharData <br/>
 * ex: {
 *         height: [],  //block height array
 *         txcount: [], //block transactions count by block height
 *         difficulty: [], //block difficulty by block height
 *         blocktime: [] //block time by block height
 *     }
 * @desc calcuate the monitor data for stats charts </br>
 */
BowerData.prototype.calcStatCharData = function (monitorData) {
  var tmpStatCharData = {
    height: [],
    txcount: [],
    difficulty: [],
    blocktime: []
  }
  if (common.isUndefined(monitorData.blockList) || monitorData.blockList.length === 0) {
    return tmpStatCharData
  }
  var tmpBlockList = monitorData.blockList.sortByHeight('asc')

  var tmpBlockHeight = common.map(tmpBlockList, 'height')
  var tmpTxCountItems = common.map(tmpBlockList, 'txcount')
  var tmpDifficultyItems = common.map(tmpBlockList, 'difficulty')
  var tmpBlockTimeItems = common.map(tmpBlockList, 'blockTime')

  tmpStatCharData = {
    height: tmpBlockHeight,
    txcount: tmpTxCountItems,
    difficulty: tmpDifficultyItems,
    blocktime: tmpBlockTimeItems
  }
  return tmpStatCharData
}

/**
 * @method calcActiveNodes
 * @param {object} monitorData
 * @returns {number} tmpActiveNodes <br/>
 * @desc calcuate the monitor data named ActiveNode </br>
 */
BowerData.prototype.calcActiveNodes = function (monitorData) {
  var tmpActiveNodes = 0
  if (common.isUndefined(monitorData.nodeList.nodeItems)) {
    return tmpActiveNodes
  }
  for (var i = 0; i < monitorData.nodeList.nodeItems.length; i++) {
    if (common.isUndefined(monitorData.nodeList.nodeItems[i].stats)) {
      log.warn('[BowerData] Node[', monitorData.nodeList.nodeItems[i].id, ']has no stats.')
      continue
    }
    if (monitorData.nodeList.nodeItems[i].stats.active) {
      tmpActiveNodes++
    }
  }
  return tmpActiveNodes
}

/**
 * @method calcTotalNodes
 * @param {object} monitorData
 * @returns {number} tmpTotalNodes <br/>
 * @desc calcuate the monitor data named TotalNodes </br>
 */
BowerData.prototype.calcTotalNodes = function (monitorData) {
  var tmpTotalNodes = 0
  if (common.isUndefined(monitorData.nodeList.nodeItems)) {
    return tmpTotalNodes
  }
  tmpTotalNodes = monitorData.nodeList.nodeItems.length
  return tmpTotalNodes
}

/**
 * @method calcNodeItems
 * @param {object} monitorData
 * @returns {array} tmpNodeItems <br/>
 * @desc calcuate the monitor data named NodeItems </br>
 */
BowerData.prototype.calcNodeItems = function (monitorData) {
  var tmpNodeItems = []
  if (common.isUndefined(monitorData) || common.isUndefined(monitorData.nodeList.nodeItems) || monitorData.nodeList.nodeItems.length === 0) {
    return tmpNodeItems
  }
  for (var i = 0; i < monitorData.nodeList.nodeItems.length; i++) {
    if (!common.isUndefined(monitorData.nodeList.nodeItems[i].id)) {
      var bowerNode = new BowerNode(monitorData.nodeList.nodeItems[i])
      tmpNodeItems.push(bowerNode.getNode())
    }
  }
  return tmpNodeItems
}

/**
 * @method getBowerData
 * @returns {object} the current bowerData <br/>
 * ex: {
 *   bestBlock: xx,
 *   lastBlock: xx,
 *   avgBlockTime: xx,
 *   activeNodes: xx,
 *   totalNodes: xx,
 *   avgNetHashRate: xx,
 *   totalTransactions: xx,
 *   nodeItems: [],
 *   statCharData: {
 *     height: [],
 *     txcount: [],
 *     blocktime  :[],
 *     difficulty :[]
 *   }
 * }
 * @desc get data from MonitorData, support to bower client </br>
 */
BowerData.prototype.getBowerData = function () {
  return {
    bestBlock: this.bestBlock,
    lastBlock: this.lastBlock,
    avgBlockTime: this.avgBlockTime,
    activeNodes: this.activeNodes,
    totalNodes: this.totalNodes,
    avgNetHashRate: this.avgNetHashRate,
    totalTransactions: this.totalTransactions,
    // nodeItems: this.nodeItems,
    nodeItems: common.orderBy(this.nodeItems, function(item) {if(item.state === 1) return Number(item.nodeLatency)}),
    statCharData: this.statCharData
  }
}

/**
 * @method printAll
 * @desc print current bowerData 
 */
BowerData.prototype.printAll = function () {
  log.debug('===========current bowerData=============')
  log.debug('bestBlock: ', this.bestBlock)
  log.debug('lastBlock: ', this.lastBlock)
  log.debug('avgBlockTime: ', this.avgBlockTime)
  log.debug('activeNodes: ', this.activeNodes)
  log.debug('totalNodes: ', this.totalNodes)
  log.debug('avgNetHashRate: ', this.avgNetHashRate)
  log.debug('totalTransactions: ', this.totalTransactions)
  log.debug('nodeItems: ')
  for (var i=0;i < this.nodeItems.length; i++) {
    log.debug('node[', i, ']: ', this.nodeItems[i])
  }
  log.debug('statCharData: ', this.statCharData)
  log.debug('blockUpdateFlag: ', this.blockUpdateFlag)
  log.debug('nodeUpdateFlag: ', this.nodeUpdateFlag)
}

module.exports = BowerData
