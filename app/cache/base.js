const hoek = require('@hapi/hoek')
const config = require('../config').cacheConfig
const { Client, Policy } = require('@hapi/catbox')
const engine = config.useRedis ? require('@hapi/catbox-redis') : require('@hapi/catbox-memory')
let standardsCache
let calculateCache
let validationCache

const setup = async () => {
  const client = new Client(engine, { partition: config.redisCatboxOptions.partition })
  await client.start()
  standardsCache = new Policy({ expiresIn: config.standardsSegment.expiresIn }, client, config.standardsSegment.name)
  calculateCache = new Policy({ expiresIn: config.standardsSegment.expiresIn }, client, config.standardsSegment.name)
  validationCache = new Policy({ expiresIn: config.validationSegment.expiresIn }, client, config.validationSegment.name)
}

const get = async (cacheName, key) => {
  const cache = getCache(cacheName)
  const object = await cache.get(key)
  return object ?? {}
}

const set = async (cacheName, key, value) => {
  const cache = getCache(cacheName)
  await cache.set(key, value, 0)
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

module.exports = {
  setup,
  get,
  set,
  update,
  clear
}
