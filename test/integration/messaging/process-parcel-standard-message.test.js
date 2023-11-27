const cache = require('../../../app/cache')
const nock = require('nock')
const config = require('../../../app/config')
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
const processParcelStandardMessage = require('../../../app/messaging/process-parcel-standard-message')
let receiver
let message
let responseApimMock
let responseLandCover
let responseSpatial
const organisationId = 1234567
const sbi = 123456789
const crn = 123456789
const token = 'token'
const standardCode = '110'

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
      messageId: 'messageId',
      body: {
        sbi,
        organisationId,
        crn,
        token,
        standardCode
      }
    }

    responseApimMock = { token_type: 'Bearer', access_token: 'token' }
    responseLandCover = [{ id: 'SJ12345678', info: [{ code: '110', name: 'Arable Land', area: 60000 }] }]
    responseSpatial = { features: [{ properties: { sheetId: 'SJ1234', parcelId: '5678' } }] }

    nock(config.apiConfig.apimAuthorizationUrl)
      .persist()
      .post('/')
      .reply(200, responseApimMock)

    nock(config.chApiGateway)
      .get(`/lms/organisation/${organisationId}/land-covers`)
      .reply(200, responseLandCover)

    nock(config.chApiGateway)
      .get(uri => uri.includes('lms'))
      .reply(200, responseSpatial)
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
    await processParcelStandardMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('sends session message if valid', async () => {
    await processParcelStandardMessage(message, receiver)
    expect(mockSendMessage).toHaveBeenCalled()
  })

  test('sends session with message Id as session Id', async () => {
    await processParcelStandardMessage(message, receiver)
    expect(mockSendMessage.mock.calls[0][0].sessionId).toBe('messageId')
  })

  test('abandons invalid message', async () => {
    message = undefined
    await processParcelStandardMessage(message, receiver)
    expect(receiver.abandonMessage).toHaveBeenCalledWith(message)
  })

  test('sets cache if no cached result', async () => {
    await processParcelStandardMessage(message, receiver)
    const result = await cache.get('parcel-standard', organisationId)
    expect(result.requests).toBeDefined()
  })

  test('adds request to cache', async () => {
    await processParcelStandardMessage(message, receiver)
    const result = await cache.get('parcel-standard', organisationId)
    expect(result.requests[0].request).toStrictEqual(message.body)
  })

  test('does not update cache if duplicate message', async () => {
    await processParcelStandardMessage(message, receiver)
    await processParcelStandardMessage(message, receiver)
    const result = await cache.get('parcel-standard', organisationId)
    expect(result.requests[0].request).toStrictEqual(message.body)
    expect(result.requests.length).toBe(1)
  })

  test('updates cache if new message', async () => {
    await processParcelStandardMessage(message, receiver)
    message.body.token = 'token2'
    await processParcelStandardMessage(message, receiver)
    const result = await cache.get('parcel-standard', organisationId)
    expect(result.requests.length).toBe(2)
  })
})
