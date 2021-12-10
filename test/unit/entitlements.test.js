const cache = require('../../app/cache')
const nock = require('nock')
const { getEntitlements } = require('../../app/legacy/entitlements')
const { chApiGateway } = require('../../app/config')

const callerId = 123456
const organisationId = 1234567
let responseEntitlementsMock

describe('entitlements', () => {
  beforeEach(async () => {
    await cache.start()
    await cache.flushAll()
    jest.clearAllMocks()

    responseEntitlementsMock = { data: [{ quantityOwned: 5 }, { quantityOwned: 5 }] }
  })

  afterEach(async () => {
    await cache.flushAll()
    await cache.stop()
  })

  afterAll(() => {
    nock.cleanAll()
  })

  test('check entitlements returns 10', async () => {
    nock(chApiGateway)
      .get(`/SitiAgriApi/entitlements/grouped/${organisationId}`)
      .reply(200, responseEntitlementsMock)

    const eligibleOrganisations = await getEntitlements(organisationId, callerId)
    expect(eligibleOrganisations).toEqual(10)
  })

  test('check entitlements returns 11', async () => {
    responseEntitlementsMock = { data: [{ quantityOwned: 5.5 }, { quantityOwned: 5.5 }] }

    nock(chApiGateway)
      .get(`/SitiAgriApi/entitlements/grouped/${organisationId}`)
      .reply(200, responseEntitlementsMock)

    const eligibleOrganisations = await getEntitlements(organisationId, callerId)
    expect(eligibleOrganisations).toEqual(11)
  })

  test('check entitlements returns < 5', async () => {
    responseEntitlementsMock = { data: [{ quantityOwned: 2 }, { quantityOwned: 1 }] }

    nock(chApiGateway)
      .get(`/SitiAgriApi/entitlements/grouped/${organisationId}`)
      .reply(200, responseEntitlementsMock)

    const eligibleOrganisations = await getEntitlements(organisationId, callerId)
    expect(eligibleOrganisations).toEqual(3)
  })
})
