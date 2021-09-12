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
      code: 110
    }

    landCover = {
      landCoverId: 110
    }

    standardLandCover = {
      landCoverId: 110,
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

  test('completes valid message', async () => {
    const standards = await getStandards(1, 123456789, 1234567)
    expect(standards).toBe()
  })
})
