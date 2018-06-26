var log = require('log4js').getLogger('model/NodeList')
var common = require('lodash')
// var MonitorError = require('./MonitorError')

/**
 * @class NodeList
 * @classdesc data saved history node info list
 * @desc
 */
var NodeList = function NodeList () {
  this.nodeItems = []
  return this
}

/**
 * @method findIndex
 * @param {object} search search condition dict <br/>
 * ex: {id: xxx}
 * @returns {number} index the data index in nodeList
 * @desc find data index from nodeList
 */
NodeList.prototype.findIndex = function (search) {
  return common.findIndex(this.nodeItems, search)
}

/**
 * @method printAll
 * @desc print data
 */
NodeList.prototype.printAll = function () {
  log.debug('[NodeList] nodeItems: ')
  for (var i = 0; i < this.nodeItems.length; i++) {
    log.debug('[NodeList] node[', i, ']: ', this.nodeItems[i])
  }
}

module.exports = NodeList
