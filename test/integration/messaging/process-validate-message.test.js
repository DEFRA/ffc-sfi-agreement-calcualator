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
const processStandardsMessage = require('../../../app/messaging/process-standards-message')
jest.mock('../../../app/api', () => {
  return {
    get: jest.fn().mockImplementation(() => {
      return [{
        id: 'SP89858277',
        info: [{
          code: '110',
          name: 'Arable Land',
          area: 0
        },
        {
          code: '130',
          name: 'Permanent Grassland',
          area: 18205.66
        },
        {
          code: '140',
          name: 'Permanent Crops',
          area: 0
        }]
      }]
    })
  }
})
let receiver
let message

describe('process standards message', () => {
  beforeEach(async () => {
    await cache.start()
    await cache.flushAll()
    receiver = {
      completeMessage: jest.fn(),
      abandonMessage: jest.fn()
    }

    message = {
      correlationId: 'correlationId',
      messageId: 'messageId',
      body: {
        organisationId: 1,
        sbi: 123456789,
        callerId: 1234567
      }
    }
  })

  afterEach(async () => {
    await cache.flushAll()
    await cache.stop()
    jest.clearAllMocks()
  })

  test('completes valid message', async () => {
    await processStandardsMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('sends session message if valid', async () => {
    await processStandardsMessage(message, receiver)
    expect(mockSendMessage).toHaveBeenCalled()
  })

  test('sends session with message Id as session Id', async () => {
    await processStandardsMessage(message, receiver)
    expect(mockSendMessage.mock.calls[0][0].sessionId).toBe('messageId')
  })

  test('sends message with standards', async () => {
    await processStandardsMessage(message, receiver)
    expect(mockSendMessage.mock.calls[0][0].body.standards).toBeDefined()
  })

  test('abandons invalid message', async () => {
    message = undefined
    await processStandardsMessage(message, receiver)
    expect(receiver.abandonMessage).toHaveBeenCalledWith(message)
  })

  test('sets cache if no cached result', async () => {
    await processStandardsMessage(message, receiver)
    const result = await cache.get('standards', 'correlationId')
    expect(result.requests).toBeDefined()
  })

  test('adds request to cache', async () => {
    await processStandardsMessage(message, receiver)
    const result = await cache.get('standards', 'correlationId')
    expect(result.requests[0].request).toStrictEqual(message.body)
  })

  test('does not update cache if duplicate message', async () => {
    await processStandardsMessage(message, receiver)
    await processStandardsMessage(message, receiver)
    const result = await cache.get('standards', 'correlationId')
    expect(result.requests[0].request).toStrictEqual(message.body)
    expect(result.requests.length).toBe(1)
  })

  test('updates cache if new message', async () => {
    await processStandardsMessage(message, receiver)
    message.body.sbi = 123456788
    await processStandardsMessage(message, receiver)
    const result = await cache.get('standards', 'correlationId')
    expect(result.requests.length).toBe(2)
  })
})
