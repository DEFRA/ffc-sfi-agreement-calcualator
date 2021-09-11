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
let receiver
let message

describe('process calculate message', () => {
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
        code: 130,
        parcels: [{
          area: 100
        }]
      }
    }
  })

  afterEach(async () => {
    await cache.flushAll()
    await cache.stop()
    jest.clearAllMocks()
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
