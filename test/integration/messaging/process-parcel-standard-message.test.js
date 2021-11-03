const cache = require('../../../app/cache')
const nock = require('nock')
const { chApiGateway, publicApi } = require('../../../app/config')
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
const db = require('../../../app/data')
let scheme
let standard
let landCover
let standardLandCover
let receiver
let message
let responseLandCover
let responseSpatial
const organisationId = 1234567
const sbi = 123456789
const callerId = 123456
const standardCode = '110'

describe('process eligibility message', () => {
  beforeAll(async () => {
    await cache.start()
    await db.sequelize.truncate({ cascade: true })

    scheme = {
      schemeId: 1,
      name: 'SFI'
    }

    standard = {
      standardId: 1,
      schemeId: 1,
      name: 'Arable and horticultural soils',
      code: '110'
    }

    landCover = {
      landCoverId: 1,
      code: '110'
    }

    standardLandCover = {
      landCoverId: 1,
      standardId: 1
    }

    await db.scheme.create(scheme)
    await db.standard.create(standard)
    await db.landCover.create(landCover)
    await db.standardLandCover.create(standardLandCover)
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
        callerId,
        standardCode
      }
    }

    responseLandCover = [{ id: 'SJ12345678', info: [{ code: '110', name: 'Arable Land', area: 60000 }] }]
    responseSpatial = { features: [{ sheet_id: 'SJ1234', parcel_id: '5678' }] }

    nock(chApiGateway)
      .get(`/lms/organisation/${organisationId}/land-covers`)
      .reply(200, responseLandCover)

    nock(publicApi)
      .filteringPath(function (path) {
        return '/'
      })
      .get('/')
      .reply(200, responseSpatial)
  })

  afterEach(async () => {
    await cache.flushAll()
    nock.cleanAll()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
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
    message.body.callerId = 510016
    await processParcelStandardMessage(message, receiver)
    const result = await cache.get('parcel-standard', organisationId)
    expect(result.requests.length).toBe(2)
  })
})
