var log = require('log4js').getLogger('model/BlockList')
var common = require('lodash')
var MonitorError = require('./MonitorError')
var Const = require('./Const')

/**
 * @class BlockList
 * @classdesc data saved history block info list
 * @desc
 */
var BlockList = function BlockList () {
  this.blockItems = []

  return this
}

/**
 * @method addData
 * @param {object} data block data
 * @returns {bool} flag
 * @desc add data to blockList
 */
BlockList.prototype.addData = function (data) {
  if (common.isUndefined(data) || data == null || common.isUndefined(data.height)) {
    log.warn('[BlockList] block data is null!')
    return false
  }
  // check if exist
  var searchBlock = this.findIndex({'height': data.height})
  log.debug('[BlockList] findIndex: ', searchBlock)
  // get current max block
  var maxHeightBlock = this.findMaxHeightBlock()
  if (common.isUndefined(maxHeightBlock)) {
    maxHeightBlock = {
      height: 0
    }
  }
  log.debug('[BlockList] findMaxHeightBlock: ', maxHeightBlock)
  if (searchBlock < 0 && data.height > maxHeightBlock.height) {
    if (this.blockItems.length >= Const.MAX_BLOCK_COUNT) {
      this.blockItems.shift()
    }
    // set the attribute of current block
    data.arrived = common.now()
    data.lastHeight = maxHeightBlock.height
    data.blockTime = 0
    // update the blocktime of last block
    if (maxHeightBlock.height > 0) {
      var maxHeightBlockIndex = this.findIndex({'height': maxHeightBlock.height})
      this.blockItems[maxHeightBlockIndex].blockTime = data.arrived - maxHeightBlock.arrived
    }
    this.blockItems.push(data)
    return true
  }
  return false
}

/**
 * @method findMaxHeightBlock
 * @returns {object} maxBlock
 * @desc find max height Block from blockList
 */
BlockList.prototype.findMaxHeightBlock = function () {
  return common.maxBy(this.blockItems, 'height')
}

/**
 * @method findIndex
 * @param {object} search <br/>
 * ex: {id: xxx}
 * @returns {number} the data index in blockList
 * @desc find data index from blockList
 */
BlockList.prototype.findIndex = function (search) {
  return common.findIndex(this.blockItems, search)
}

/**
 * @method sortByHeight
 * @param {string} order <br/>
 * ex:asc or desc
 * @returns {array} the block array which is sorted by block height
 * @desc sort blockList by block.height
 */
BlockList.prototype.sortByHeight = function (order) {
  if (common.isUndefined(this.blockItems) || this.blockItems.length === 0) {
    return
  }
  if (order !== 'asc' && order !== 'desc') {
    log.warn('[BlockList] param order err, must in [asc, desc]')
    return
  }
  return common.orderBy(this.blockItems, 'height', order)
}

/**
 * @method printAll
 * @desc print block items
 */
BlockList.prototype.printAll = function () {
  log.debug('[BlockList] blockItems: ')
  for (var i = 0; i < this.blockItems.length; i++) {
    log.debug('[BlockList] block[', i, ']: ', this.blockItems[i])
  }
}

module.exports = BlockList
