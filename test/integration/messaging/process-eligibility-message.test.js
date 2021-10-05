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
const processEligibilityMessage = require('../../../app/messaging/process-eligibility-message')
let receiver
let message

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
        crn: 1234567890,
        callerId: 510015
      }
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await cache.flushAll()
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
