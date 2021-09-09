const hoek = require('@hapi/hoek')
const config = require('../config').cacheConfig
const { isDeepStrictEqual } = require('util')
let standardsCache
let validationCache
let calculateCache

const setup = (server) => {
  standardsCache = server.cache({
    expiresIn: config.standardsSegment.expiresIn,
    segment: config.standardsSegment.name
  })
  validationCache = server.cache({
    expiresIn: config.validationSegment.expiresIn,
    segment: config.validationSegment.name
  })
  calculateCache = server.cache({
    expiresIn: config.calculateSegment.expiresIn,
    segment: config.calculateSegment.name
  })
}

const get = async (cacheName, key) => {
  const cache = getCache(cacheName)
  const object = await cache.get(key)
  return object ?? {}
}

const set = async (cacheName, key, value) => {
  const cache = getCache(cacheName)
  await cache.set(key, value)
}

const update = async (cacheName, key, object) => {
  const existing = await get(cacheName, key)
  hoek.merge(existing, object, { mergeArrays: false })
  await set(cacheName, key, existing)
}

const clear = async (cacheName, key) => {
  const cache = getCache(cacheName)
  await cache.drop(key)
}

const getCache = (cacheName) => {
  switch (cacheName) {
    case 'standards':
      return standardsCache
    case 'validation':
      return validationCache
    case 'calculate':
      return calculateCache
    default:
      throw new Error(`Cache ${cacheName} does not exist`)
  }
}

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

const getRequestIndex = (cacheData, request) => {
  return cacheData.requests.findIndex(x => isDeepStrictEqual(x.request, request))
}

const updateCache = async (cacheName, key, request, response) => {
  const cacheData = await get(cacheName, key)
  const requestIndex = getRequestIndex(cacheData, request)
  cacheData.requests[requestIndex].response = response
  await update(cacheName, key, cacheData)
}

module.exports = {
  setup,
  get,
  set,
  update,
  clear,
  updateCache,
  getCachedResponse
}
