const { start, stop, get, set, update, clear, flushAll } = require('./base')
const getCachedResponse = require('./get-cached-response')
const setCachedResponse = require('./set-cached-response')

module.exports = {
  start,
  stop,
  get,
  set,
  update,
  clear,
  flushAll,
  getCachedResponse,
  setCachedResponse
}
