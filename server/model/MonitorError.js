
/**
 * @class MonitorError
 * @classdesc seele-monitor defined Error
 * @desc
 */
function MonitorError (message) {
  this.message = message
  this.name = 'MonitorError'
}

MonitorError.prototype = new Error()
MonitorError.prototype.constructor = MonitorError

module.exports = MonitorError
