const { isDeepStrictEqual } = require('util')
const { get, update } = require('./base')
const getRequestIndex = require('./get-request-index')

const getCachedResponse = async (cacheName, request, key) => {
  const cacheData = await get(cacheName, key)

  // ensure an array for all session requests created
  if (!cacheData.requests) {
    cacheData.requests = []
  }

  // if request is unique, add to cache
  if (!cacheData.requests.some(x => isDeepStrictEqual(x.request, request))) {
    cacheData.requests.push({ request })
    await update(cacheName, key, cacheData)
  }

  // find cache entry for request
  const requestIndex = getRequestIndex(cacheData, request)

  return cacheData.requests[requestIndex].response
}

module.exports = getCachedResponse
