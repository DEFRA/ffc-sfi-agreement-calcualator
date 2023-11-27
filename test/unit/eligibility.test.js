const cache = require('../../app/cache')
const nock = require('nock')
const { getEligibleOrganisations } = require('../../app/eligibility')
const config = require('../../app/config')

const token = 'token'
const crn = 1234567890
const organisationId = 1234567
const name = 'Title Forename LastName'
const sbi = 123456789

let responseMock
let responseApimMock
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

    responseApimMock = { token_type: 'Bearer', access_token: 'token' }
    responseEligibilityMock = { data: [{ quantityOwned: 5 }] }
    responseOrganisationsMock = { _data: [{ id: organisationId, name, sbi }] }
    responseLandCover = [{ id: 'SJ12345678', info: [{ code: '110', name: 'Arable Land', area: 60000 }] }]
    responseOrganisationMock = { _data: { id: organisationId, name, sbi, address: { address1: 'address1', address2: 'address2', address3: 'address3', postalCode: 'postalCode' } } }

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

  test('check eligibility returns empty array - No organisations found', async () => {
    responseMock = []
    responseOrganisationsMock = {}

    nock(config.chApiGateway)
      .get('/organisation/person/3337243/summary?search=')
      .reply(200, responseOrganisationsMock)

    const eligibleOrganisations = await getEligibleOrganisations(crn, token)
    expect(eligibleOrganisations).toEqual(responseMock)
  })

  test('check eligibility returns empty array - Land < 5 ha', async () => {
    responseMock = []
    responseLandCover = [{ id: 'SJ12345678', info: [{ code: '110', name: 'Arable Land', area: 0 }] }]

    nock(config.chApiGateway)
      .get(`/SitiAgriApi/entitlements/grouped/${organisationId}`)
      .reply(200, responseEligibilityMock)

    nock(config.chApiGateway)
      .get('/organisation/person/3337243/summary?search=')
      .reply(200, responseOrganisationsMock)

    nock(config.chApiGateway)
      .get(`/lms/organisation/${organisationId}/land-covers`)
      .reply(200, responseLandCover)

    const eligibleOrganisations = await getEligibleOrganisations(crn, token)
    expect(eligibleOrganisations).toEqual(responseMock)
  })

  test('check eligibility returns array - Land calculated over 5 ha', async () => {
    nock(config.chApiGateway)
      .get(`/SitiAgriApi/entitlements/grouped/${organisationId}`)
      .reply(200, responseEligibilityMock)

    nock(config.chApiGateway)
      .get('/organisation/person/3337243/summary?search=')
      .reply(200, responseOrganisationsMock)

    responseLandCover = [{ id: 'SJ80778858', info: [{ code: '110', name: 'Arable Land', area: 20000 }, { code: '130', name: 'Permanent Grasslands', area: 40000 }] }]

    nock(config.chApiGateway)
      .get(`/lms/organisation/${organisationId}/land-covers`)
      .reply(200, responseLandCover)

    nock(config.chApiGateway)
      .get(`/organisation/${organisationId}`)
      .reply(200, responseOrganisationMock)

    const eligibleOrganisations = await getEligibleOrganisations(crn, token)
    expect(eligibleOrganisations).toEqual(responseMock)
  })

  test('check eligibility', async () => {
    nock(config.chApiGateway)
      .get('/organisation/person/3337243/summary?search=')
      .reply(200, responseOrganisationsMock)

    nock(config.chApiGateway)
      .get(`/SitiAgriApi/entitlements/grouped/${organisationId}`)
      .reply(200, responseEligibilityMock)

    nock(config.chApiGateway)
      .get(`/lms/organisation/${organisationId}/land-covers`)
      .reply(200, responseLandCover)

    nock(config.chApiGateway)
      .get(`/organisation/${organisationId}`)
      .reply(200, responseOrganisationMock)

    const eligibleOrganisations = await getEligibleOrganisations(crn, token)
    expect(eligibleOrganisations).toEqual(responseMock)
  })
})
