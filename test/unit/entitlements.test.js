const cache = require('../../app/cache')
const nock = require('nock')
const getEntitlements = require('../../app/legacy/entitlements')
const config = require('../../app/config')

const crn = 123456789
const token = 'token'
const organisationId = 1234567
let responseEntitlementsMock
let responseApimMock

describe('entitlements', () => {
  beforeEach(async () => {
    await cache.start()
    await cache.flushAll()
    jest.clearAllMocks()

    responseEntitlementsMock = { data: [{ quantityOwned: 5 }, { quantityOwned: 5 }] }
    responseApimMock = { token_type: 'Bearer', access_token: 'token' }

    nock(config.apiConfig.apimAuthorizationUrl)
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

  test('check entitlements returns 10', async () => {
    nock(config.chApiGateway)
      .get(`/SitiAgriApi/entitlements/grouped/${organisationId}`)
      .reply(200, responseEntitlementsMock)

    const eligibleOrganisations = await getEntitlements(organisationId, crn, token)
    expect(eligibleOrganisations).toEqual(10)
  })

  test('check entitlements returns 11', async () => {
    responseEntitlementsMock = { data: [{ quantityOwned: 5.5 }, { quantityOwned: 5.5 }] }

    nock(config.chApiGateway)
      .get(`/SitiAgriApi/entitlements/grouped/${organisationId}`)
      .reply(200, responseEntitlementsMock)

    const eligibleOrganisations = await getEntitlements(organisationId, crn, token)
    expect(eligibleOrganisations).toEqual(11)
  })

  test('check entitlements returns < 5', async () => {
    responseEntitlementsMock = { data: [{ quantityOwned: 2 }, { quantityOwned: 1 }] }

    nock(config.chApiGateway)
      .get(`/SitiAgriApi/entitlements/grouped/${organisationId}`)
      .reply(200, responseEntitlementsMock)

    const eligibleOrganisations = await getEntitlements(organisationId, crn, token)
    expect(eligibleOrganisations).toEqual(3)
  })
})
