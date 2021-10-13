const nock = require('nock')
const { getLandCover, getLandCoverArea } = require('../../app/land-cover')
const { chApiGateway } = require('../../app/config')
const { convertMetresToHectares } = require('../../app/conversion')

const callerId = 123456
const organisationId = 1234567

let responseMock

describe('eligibility', () => {
  beforeEach(() => {
    jest.clearAllMocks()

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
  })

  afterAll(() => {
    nock.cleanAll()
  })

  test('check land cover - area conversion from meters to ha ', async () => {
    nock(chApiGateway)
      .get(`/lms/organisation/${organisationId}/land-covers`)
      .reply(200, responseMock)

    const landParcels = await getLandCover(organisationId, callerId)
    const parcels = landParcels[0].info
    expect(parcels[0].area).toEqual(500)
    expect(parcels[1].area).toEqual(500)
  })

  test('check land cover - calculate total area (not inc 000 BPSIneligibleFeature) ', async () => {
    nock(chApiGateway)
      .get(`/lms/organisation/${organisationId}/land-covers`)
      .reply(200, responseMock)

    const calculateReturnArea = convertMetresToHectares(responseMock[0].info.reduce((acc, curr) => {
      const currArea = curr.code === '000' ? 0 : curr.area
      return acc + currArea
    }, 0))

    const landParcels = await getLandCoverArea(organisationId, callerId)
    expect(calculateReturnArea).toEqual(1000)
    expect(landParcels).toEqual(calculateReturnArea)
  })
})
