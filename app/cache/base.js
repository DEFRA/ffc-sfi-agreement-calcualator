const hoek = require('@hapi/hoek')
const config = require('../config').cacheConfig
const { createClient } = require('redis')
let client

const start = async () => {
  client = createClient({ socket: config.socket })
  await client.connect()
}

const get = async (cache, key) => {
  const fullKey = getFullKey(cache, key)
  const object = await client.get(fullKey)
  return object ?? {}
}

const set = async (cache, key, value) => {
  const fullKey = getFullKey(cache)
  await client.set(fullKey, value)
}

const update = async (cache, key, object) => {
  const existing = await client.hGetAll(cache, key)
  hoek.merge(existing, object, { mergeArrays: false })
  await set(cache, key, existing)
}

const clear = async (cache, key) => {
  const fullKey = getFullKey(cache, key)
  await client.del(fullKey)
}

const getFullKey = (cache, key) => {
  const prefix = getKeyPrefix(cache)
  return `${prefix}:${key}`
}

const getKeyPrefix = (cache) => {
  return `${config.partition}:${cache}`
}

module.exports = {
  start,
  get,
  set,
  update,
  clear
}
