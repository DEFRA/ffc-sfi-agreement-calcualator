const cache = require('../../../app/cache/base')

describe('base caching', () => {
  beforeEach(async () => {
    await cache.start()
    await cache.flushAll()
  })

  afterEach(async () => {
    await cache.flushAll()
    await cache.stop()
  })

  test('sets and gets string value', async () => {
    await cache.set('testCache', 'testKey', 'testValue')
    const result = await cache.get('testCache', 'testKey')
    expect(result).toBe('testValue')
  })

  test('sets and gets object value', async () => {
    await cache.set('testCache', 'testKey', { value: 'testValue' })
    const result = await cache.get('testCache', 'testKey')
    expect(result).toStrictEqual({ value: 'testValue' })
  })

  test('updates object value', async () => {
    await cache.set('testCache', 'testKey', { value: 'testValue' })
    await cache.update('testCache', 'testKey', { nextValue: 'testValue2' })
    const result = await cache.get('testCache', 'testKey')
    expect(result).toStrictEqual({ value: 'testValue', nextValue: 'testValue2' })
  })

  test('updates object value with array', async () => {
    await cache.set('testCache', 'testKey', { value: 'testValue' })
    await cache.update('testCache', 'testKey', { nextValue: ['testValue2'] })
    const result = await cache.get('testCache', 'testKey')
    expect(result).toStrictEqual({ value: 'testValue', nextValue: ['testValue2'] })
  })

  test('updates object value replacing array without merging', async () => {
    await cache.set('testCache', 'testKey', { value: ['testValue'] })
    await cache.update('testCache', 'testKey', { value: ['testValue2'] })
    const result = await cache.get('testCache', 'testKey')
    expect(result).toStrictEqual({ value: ['testValue2'] })
  })

  test('updates object value replaces value', async () => {
    await cache.set('testCache', 'testKey', { value: 'testValue' })
    await cache.update('testCache', 'testKey', { value: 'testValue2' })
    const result = await cache.get('testCache', 'testKey')
    expect(result).toStrictEqual({ value: 'testValue2' })
  })

  test('segments by cache name', async () => {
    await cache.set('testCache', 'testKey', 'testValue')
    await cache.set('testCache2', 'testKey', 'testValue2')
    const result = await cache.get('testCache', 'testKey')
    const result2 = await cache.get('testCache2', 'testKey')
    expect(result).toBe('testValue')
    expect(result2).toBe('testValue2')
  })

  test('returns empty object if key does not exist', async () => {
    const result = await cache.get('testCache', 'testKey')
    expect(result).toStrictEqual({})
  })
})
