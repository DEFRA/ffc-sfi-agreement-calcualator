const { get, update } = require('./base')
const getRequestIndex = require('./get-request-index')

const setCachedResponse = async (cacheName, key, request, response) => {
  const cacheData = await get(cacheName, key)
  const requestIndex = getRequestIndex(cacheData, request)
  cacheData.requests[requestIndex].response = response
  console.log('Caching value')
  await update(cacheName, key, cacheData)
}

module.exports = setCachedResponse
