const cache = require('../../../app/cache')
const nock = require('nock')
const { chApiGateway } = require('../../../app/config')
const mockSendMessage = jest.fn()
jest.mock('ffc-messaging', () => {
  return {
    MessageSender: jest.fn().mockImplementation(() => {
      return {
        sendMessage: mockSendMessage,
        closeConnection: jest.fn()
      }
    })
  }
})
const mockSendEvents = jest.fn()
jest.mock('ffc-events', () => {
  return {
    EventSender: jest.fn().mockImplementation(() => {
      return {
        connect: jest.fn(),
        sendEvents: mockSendEvents,
        closeConnection: jest.fn()
      }
    })
  }
})
const processEligibilityMessage = require('../../../app/messaging/process-eligibility-message')
let receiver
let message
let responseOrganisationsMock
let responseLandCover
let responseOrganisationMock
const organisationId = 1234567
const name = 'Title Forename LastName'
const sbi = 123456789
const crn = 1234567890
const callerId = 123456

describe('process eligibility message', () => {
  beforeAll(async () => {
    await cache.start()
  })

  beforeEach(async () => {
    receiver = {
      completeMessage: jest.fn(),
      abandonMessage: jest.fn()
    }

    message = {
      correlationId: 'correlationId',
      messageId: 'messageId',
      body: {
        crn,
        callerId
      }
    }

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
    nock.cleanAll()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await cache.stop()
  })

  test('completes valid message', async () => {
    await processEligibilityMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('sends session message if valid', async () => {
    await processEligibilityMessage(message, receiver)
    expect(mockSendMessage).toHaveBeenCalled()
  })

  test('sends session with message Id as session Id', async () => {
    await processEligibilityMessage(message, receiver)
    expect(mockSendMessage.mock.calls[0][0].sessionId).toBe('messageId')
  })

  test('abandons invalid message', async () => {
    message = undefined
    await processEligibilityMessage(message, receiver)
    expect(receiver.abandonMessage).toHaveBeenCalledWith(message)
  })

  test('sets cache if no cached result', async () => {
    await processEligibilityMessage(message, receiver)
    const result = await cache.get('eligibility', 'correlationId')
    expect(result.requests).toBeDefined()
  })

  test('adds request to cache', async () => {
    await processEligibilityMessage(message, receiver)
    const result = await cache.get('eligibility', 'correlationId')
    expect(result.requests[0].request).toStrictEqual(message.body)
  })

  test('does not update cache if duplicate message', async () => {
    await processEligibilityMessage(message, receiver)
    await processEligibilityMessage(message, receiver)
    const result = await cache.get('eligibility', 'correlationId')
    expect(result.requests[0].request).toStrictEqual(message.body)
    expect(result.requests.length).toBe(1)
  })

  test('updates cache if new message', async () => {
    await processEligibilityMessage(message, receiver)
    message.body.callerId = 510016
    await processEligibilityMessage(message, receiver)
    const result = await cache.get('eligibility', 'correlationId')
    expect(result.requests.length).toBe(2)
  })
})
