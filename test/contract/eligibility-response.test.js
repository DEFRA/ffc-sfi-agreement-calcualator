const cache = require('../../app/cache')
const events = require('../../app/events')
const nock = require('nock')
const config = require('../../app/config')
const { MessageProviderPact } = require('@pact-foundation/pact')
const { getEligibleOrganisations } = require('../../app/eligibility')
const createMessage = require('../../app/messaging/create-message')

describe('publishing an eligibility check response', () => {
  let responseApimMock
  let responseOrganisationsMock
  let responseLandCover
  let responseOrganisationMock
  let responseEntitlementMock
  const organisationId = '1234567'
  const name = 'Title Forename LastName'
  const sbi = 123456789
  const crn = 123456789
  const token = 'token'

  beforeAll(async () => {
    await events.start()
    await cache.start()
    await cache.flushAll()

    responseApimMock = { token_type: 'Bearer', access_token: 'token' }
    responseOrganisationsMock = { _data: [{ id: organisationId, name, sbi }] }
    responseLandCover = [{ id: 'SJ12345678', info: [{ code: '110', name: 'Arable Land', area: 60000 }] }]
    responseOrganisationMock = { _data: { id: organisationId, name, sbi, address: { address1: 'address1', address2: 'address2', address3: 'address3', postalCode: 'postalCode' } } }
    responseEntitlementMock = { data: [{ quantityOwned: 5 }] }

    nock(config.apiConfig.apimAuthorizationUrl)
      .persist()
      .post('/')
      .reply(200, responseApimMock)

    nock(config.chApiGateway)
      .get('/organisation/person/3337243/summary?search=')
      .reply(200, responseOrganisationsMock)

    nock(config.chApiGateway)
      .get(`/lms/organisation/${organisationId}/land-covers`)
      .reply(200, responseLandCover)

    nock(config.chApiGateway)
      .get(`/organisation/${organisationId}`)
      .reply(200, responseOrganisationMock)

    nock(config.chApiGateway)
      .get(`/SitiAgriApi/entitlements/grouped/${organisationId}`)
      .reply(200, responseEntitlementMock)
  })

  afterEach(async () => {
    await cache.flushAll()
    await cache.stop()
    await events.stop()
    nock.cleanAll()
  })

  test('eligibility response satisfies all contracts', async () => {
    const eligibilityResult = getEligibleOrganisations(1234657890, crn, token)
    const provider = new MessageProviderPact({
      messageProviders: {
        'a new eligibility check': () => createMessage(eligibilityResult).body
      },
      provider: 'ffc-sfi-agreement-calculator',
      consumerVersionTags: ['main', 'dev', 'test', 'preprod', 'prod'],
      pactBrokerUrl: process.env.PACT_BROKER_URL,
      pactBrokerUsername: process.env.PACT_BROKER_USERNAME,
      pactBrokerPassword: process.env.PACT_BROKER_PASSWORD
    })

    return provider.verify()
  })
})
