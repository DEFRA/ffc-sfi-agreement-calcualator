const { start, stop, get, set, update, clear } = require('./base')
const getCachedResponse = require('./get-cached-response')
const setCachedResponse = require('./set-cached-response')

module.exports = {
  start,
  stop,
  get,
  set,
  update,
  clear,
  getCachedResponse,
  setCachedResponse
}
