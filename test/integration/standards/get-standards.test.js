jest.mock('ffc-events')
const cache = require('../../../app/cache')
const getStandards = require('../../../app/standards')
jest.mock('../../../app/api/private', () => {
  return {
    get: jest.fn().mockImplementation(() => {
      return [{
        id: 'SP89858277',
        info: [{
          code: '110',
          name: 'Arable Land',
          area: 0
        },
        {
          code: '130',
          name: 'Permanent Grassland',
          area: 18205.66
        },
        {
          code: '140',
          name: 'Permanent Crops',
          area: 0
        }]
      }, {
        id: 'SP89858278',
        info: [{
          code: '110',
          name: 'Arable Land',
          area: 127.55
        },
        {
          code: '130',
          name: 'Permanent Grassland',
          area: 18205.66
        },
        {
          code: '140',
          name: 'Permanent Crops',
          area: 0
        }]
      }, {
        id: 'SP89858279',
        info: [{
          code: '110',
          name: 'Arable Land',
          area: 43.51
        },
        {
          code: '130',
          name: 'Permanent Grassland',
          area: 18205.66
        },
        {
          code: '140',
          name: 'Permanent Crops',
          area: 0
        }]
      }]
    })
  }
})

describe('get standards', () => {
  beforeEach(async () => {
    await cache.start()
    await cache.flushAll()
  })

  afterEach(async () => {
    await cache.flushAll()
    await cache.stop()
  })

  test('returns code', async () => {
    const standards = await getStandards(1, 123456789, 1234567)
    expect(standards.standards[0].code).toBe('sfi-arable-soil')
  })

  test('returns only valid land covers', async () => {
    const standards = await getStandards(1, 123456789, 1234567)
    expect(standards.standards[0].landCovers.length).toBe(2)
    expect(standards.standards[0].landCovers.filter(x => x.parcelId === 'SP89858278').length).toBe(1)
    expect(standards.standards[0].landCovers.filter(x => x.parcelId === 'SP89858279').length).toBe(1)
  })

  test('returns valid parcel areas', async () => {
    const standards = await getStandards(1, 123456789, 1234567)
    expect(standards.standards[0].landCovers.find(x => x.parcelId === 'SP89858278').area).toBe('0.02')
    expect(standards.standards[0].landCovers.find(x => x.parcelId === 'SP89858279').area).toBe('0.01')
  })
})
