const cache = require('../../../app/cache')
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
const processCalculateMessage = require('../../../app/messaging/process-calculate-message')
const db = require('../../../app/data')
let scheme
let standard
let levels
let rates
let receiver
let message

describe('process calculate message', () => {
  beforeAll(async () => {
    await cache.start()
  })

  beforeEach(async () => {
    await cache.flushAll()
    await db.sequelize.truncate({ cascade: true })

    scheme = {
      schemeId: 1,
      name: 'SFI'
    }

    standard = {
      standardId: 1,
      schemeId: 1,
      name: 'Arable and horticultural soils',
      code: 110
    }

    levels = [{
      levelId: 1,
      standardId: 1,
      name: 'Introductory'
    }, {
      levelId: 2,
      standardId: 1,
      name: 'Intermediate'
    }, {
      levelId: 3,
      standardId: 1,
      name: 'Advanced'
    }]

    rates = [{
      rateId: 1,
      levelId: 1,
      rate: 2600
    }, {
      rateId: 2,
      levelId: 2,
      rate: 4100
    }, {
      rateId: 3,
      levelId: 3,
      rate: 6000
    }]

    await db.scheme.create(scheme)
    await db.standard.create(standard)
    await db.level.bulkCreate(levels)
    await db.rate.bulkCreate(rates)

    receiver = {
      completeMessage: jest.fn(),
      abandonMessage: jest.fn()
    }

    message = {
      correlationId: 'correlationId',
      messageId: 'messageId',
      body: {
        code: 110,
        parcels: [{
          area: 100
        }]
      }
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
    await cache.flushAll()
    await cache.stop()
  })

  test('completes valid message', async () => {
    await processCalculateMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('sends session message if valid', async () => {
    await processCalculateMessage(message, receiver)
    expect(mockSendMessage).toHaveBeenCalled()
  })

  test('sends session with message Id as session Id', async () => {
    await processCalculateMessage(message, receiver)
    expect(mockSendMessage.mock.calls[0][0].sessionId).toBe('messageId')
  })

  test('sends message with all ambition levels', async () => {
    await processCalculateMessage(message, receiver)
    expect(mockSendMessage.mock.calls[0][0].body.Introductory).toBeDefined()
    expect(mockSendMessage.mock.calls[0][0].body.Intermediate).toBeDefined()
    expect(mockSendMessage.mock.calls[0][0].body.Advanced).toBeDefined()
  })

  test('abandons invalid message', async () => {
    message = undefined
    await processCalculateMessage(message, receiver)
    expect(receiver.abandonMessage).toHaveBeenCalledWith(message)
  })

  test('sets cache if no cached result', async () => {
    await processCalculateMessage(message, receiver)
    const result = await cache.get('calculate', 'correlationId')
    expect(result.requests).toBeDefined()
  })

  test('adds request to cache', async () => {
    await processCalculateMessage(message, receiver)
    const result = await cache.get('calculate', 'correlationId')
    expect(result.requests[0].request).toStrictEqual(message.body)
  })

  test('does not update cache if duplicate message', async () => {
    await processCalculateMessage(message, receiver)
    await processCalculateMessage(message, receiver)
    const result = await cache.get('calculate', 'correlationId')
    expect(result.requests[0].request).toStrictEqual(message.body)
    expect(result.requests.length).toBe(1)
  })

  test('updates cache if new message', async () => {
    await processCalculateMessage(message, receiver)
    message.body.parcels[0].area = 50
    await processCalculateMessage(message, receiver)
    const result = await cache.get('calculate', 'correlationId')
    expect(result.requests.length).toBe(2)
  })
})
