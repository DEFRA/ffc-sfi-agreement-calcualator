const cache = require('../../app/cache')
const nock = require('nock')
const { getEligibleOrganisations } = require('../../app/eligibility')
const { chApiGateway } = require('../../app/config')

const callerId = 123456
const crn = 1234567890
const organisationId = 1234567
const name = 'Title Forename LastName'
const sbi = 123456789

let responseMock
let responseOrganisationsMock
let responseLandCover
let responseOrganisationMock
let responseEligibilityMock

describe('eligibility', () => {
  beforeEach(async () => {
    await cache.start()
    await cache.flushAll()
    jest.clearAllMocks()

    responseMock = [
      {
        sbi,
        name,
        organisationId,
        address: 'address1, address2, address3, postalCode'
      }
    ]

    responseEligibilityMock = { data: [{ quantityOwned: 5 }] }
    responseOrganisationsMock = { _data: [{ id: organisationId, name, sbi }] }
    responseLandCover = [{ id: 'SJ12345678', info: [{ code: '110', name: 'Arable Land', area: 60000 }] }]
    responseOrganisationMock = { _data: { id: organisationId, name, sbi, address: { address1: 'address1', address2: 'address2', address3: 'address3', postalCode: 'postalCode' } } }
  })

  afterEach(async () => {
    await cache.flushAll()
    await cache.stop()
  })

  afterAll(() => {
    nock.cleanAll()
  })

  test('check eligibility returns empty array - No organisations found', async () => {
    responseMock = []
    responseOrganisationsMock = {}

    nock(chApiGateway)
      .get(`/organisation/person/${callerId}/summary?search=`)
      .reply(200, responseOrganisationsMock)

    const eligibleOrganisations = await getEligibleOrganisations(crn, callerId)
    expect(eligibleOrganisations).toEqual(responseMock)
  })

  test('check eligibility returns empty array - Land < 5 ha', async () => {
    responseMock = []
    responseLandCover = [{ id: 'SJ12345678', info: [{ code: '110', name: 'Arable Land', area: 0 }] }]

    nock(chApiGateway)
      .get(`/SitiAgriApi/entitlements/grouped/${organisationId}`)
      .reply(200, responseEligibilityMock)

    nock(chApiGateway)
      .get(`/organisation/person/${callerId}/summary?search=`)
      .reply(200, responseOrganisationsMock)

    nock(chApiGateway)
      .get(`/lms/organisation/${organisationId}/land-covers`)
      .reply(200, responseLandCover)

    const eligibleOrganisations = await getEligibleOrganisations(crn, callerId)
    expect(eligibleOrganisations).toEqual(responseMock)
  })

  test('check eligibility returns array - Land calculated over 5 ha', async () => {
    nock(chApiGateway)
      .get(`/SitiAgriApi/entitlements/grouped/${organisationId}`)
      .reply(200, responseEligibilityMock)

    nock(chApiGateway)
      .get(`/organisation/person/${callerId}/summary?search=`)
      .reply(200, responseOrganisationsMock)

    responseLandCover = [{ id: 'SJ80778858', info: [{ code: '110', name: 'Arable Land', area: 20000 }, { code: '130', name: 'Permanent Grasslands', area: 40000 }] }]

    nock(chApiGateway)
      .get(`/lms/organisation/${organisationId}/land-covers`)
      .reply(200, responseLandCover)

    nock(chApiGateway)
      .get(`/organisation/${organisationId}`)
      .reply(200, responseOrganisationMock)

    const eligibleOrganisations = await getEligibleOrganisations(crn, callerId)
    expect(eligibleOrganisations).toEqual(responseMock)
  })

  test('check eligibility', async () => {
    nock(chApiGateway)
      .get(`/organisation/person/${callerId}/summary?search=`)
      .reply(200, responseOrganisationsMock)

    nock(chApiGateway)
      .get(`/SitiAgriApi/entitlements/grouped/${organisationId}`)
      .reply(200, responseEligibilityMock)

    nock(chApiGateway)
      .get(`/lms/organisation/${organisationId}/land-covers`)
      .reply(200, responseLandCover)

    nock(chApiGateway)
      .get(`/organisation/${organisationId}`)
      .reply(200, responseOrganisationMock)

    const eligibleOrganisations = await getEligibleOrganisations(crn, callerId)
    expect(eligibleOrganisations).toEqual(responseMock)
  })
})
