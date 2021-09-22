const getStandards = require('../../../app/standards')
jest.mock('../../../app/api', () => {
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
const db = require('../../../app/data')
let scheme
let standard
let landCover
let standardLandCover

describe('get standards', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    scheme = {
      schemeId: 1,
      name: 'SFI'
    }

    standard = {
      standardId: 1,
      schemeId: 1,
      name: 'Arable and horticultural soils',
      code: '110'
    }

    landCover = {
      landCoverId: 1,
      code: '110'
    }

    standardLandCover = {
      landCoverId: 1,
      standardId: 1
    }

    await db.scheme.create(scheme)
    await db.standard.create(standard)
    await db.landCover.create(landCover)
    await db.standardLandCover.create(standardLandCover)
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('returns code', async () => {
    const standards = await getStandards(1, 123456789, 1234567)
    expect(standards[0].code).toBe('110')
  })

  test('returns valid land cover codes', async () => {
    const standards = await getStandards(1, 123456789, 1234567)
    expect(standards[0].landCoverCodes.length).toBe(1)
    expect(standards[0].landCoverCodes[0]).toBe('110')
  })

  test('returns standard codes', async () => {
    const standards = await getStandards(1, 123456789, 1234567)
    expect(standards[0].code).toBe('110')
  })

  test('returns only valid parcels', async () => {
    const standards = await getStandards(1, 123456789, 1234567)
    expect(standards[0].parcels.length).toBe(2)
    expect(standards[0].parcels.filter(x => x.id === 'SP89858278').length).toBe(1)
    expect(standards[0].parcels.filter(x => x.id === 'SP89858279').length).toBe(1)
  })

  test('returns valid parcel area', async () => {
    const standards = await getStandards(1, 123456789, 1234567)
    expect(Number(standards[0].parcels.find(x => x.id === 'SP89858278').area)).toBeGreaterThan(0)
    expect(Number(standards[0].parcels.find(x => x.id === 'SP89858279').area)).toBeGreaterThan(0)
  })
})
