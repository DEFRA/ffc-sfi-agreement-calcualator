const cache = require('../../app/cache')
const nock = require('nock')
const { chApiGateway } = require('../../app/config')
const { MessageProviderPact } = require('@pact-foundation/pact')
const { getEligibleOrganisations } = require('../../app/eligibility')
const createMessage = require('../../app/messaging/create-message')

describe('publishing an eligibility check response', () => {
  let responseOrganisationsMock
  let responseLandCover
  let responseOrganisationMock
  const organisationId = 1234567
  const name = 'Title Forename LastName'
  const sbi = 123456789
  const callerId = 123456

  beforeAll(async () => {
    await cache.start()
    await cache.flushAll()

    responseOrganisationsMock = { _data: [{ id: organisationId, name, sbi }] }
    responseLandCover = [{ id: 'SJ12345678', info: [{ code: '110', name: 'Arable Land', area: 60000 }] }]
    responseOrganisationMock = { _data: { id: organisationId, name, sbi, address: { address1: 'address1', address2: 'address2', address3: 'address3', postalCode: 'postalCode' } } }

    nock(chApiGateway)
      .get(`/organisation/person/${callerId}/summary?search=`)
      .reply(200, responseOrganisationsMock)

    nock(chApiGateway)
      .get(`/lms/organisation/${organisationId}/land-covers`)
      .reply(200, responseLandCover)

    nock(chApiGateway)
      .get(`/organisation/${organisationId}`)
      .reply(200, responseOrganisationMock)
  })

  afterEach(async () => {
    await cache.flushAll()
    await cache.stop()
    nock.cleanAll()
  })

  test('eligibility response satisfies all contracts', async () => {
    const eligibilityResult = getEligibleOrganisations(1234657890, callerId)
    const provider = new MessageProviderPact({
      messageProviders: {
        'eligibility check response': () => createMessage(eligibilityResult).body
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
