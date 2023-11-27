const cache = require('../../app/cache')
const nock = require('nock')
const { getParcels } = require('../../app/legacy/land')
const config = require('../../app/config')

const token = 'token'
const crn = 1234567890
const organisationId = 1234567

let responseApimMock
let responseMock

describe('eligibility', () => {
  beforeEach(async () => {
    await cache.start()
    await cache.flushAll()
    jest.clearAllMocks()

    responseApimMock = { token_type: 'Bearer', access_token: 'token' }

    responseMock = [
      {
        id: 'AB12345678',
        info: [
          {
            code: '000',
            name: 'BPSIneligibleFeature',
            area: 50000
          },
          {
            code: '110',
            name: 'Arable Land',
            area: 50000
          },
          {
            code: '130',
            name: 'Permanent Grassland',
            area: 50000
          }
        ]
      }
    ]

    nock(config.apiConfig.apimAuthorizationUrl)
      .persist()
      .post('/')
      .reply(200, responseApimMock)
  })

  afterEach(async () => {
    await cache.flushAll()
    await cache.stop()
  })

  afterAll(() => {
    nock.cleanAll()
  })

  test('check land cover - area conversion from meters to ha ', async () => {
    nock(config.chApiGateway)
      .get(`/lms/organisation/${organisationId}/land-covers`)
      .reply(200, responseMock)

    const landParcels = await getParcels(organisationId, crn, token)
    const parcels = landParcels[0].info
    expect(parcels[0].area).toEqual(500)
    expect(parcels[1].area).toEqual(500)
  })
})
