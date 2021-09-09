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
const processCalculateMessage = require('../../../../app/messaging/process-calculate-message')
jest.mock('../../../../app/cache')
let receiver
let message

describe('process calculate message', () => {
  beforeEach(async () => {
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

  afterEach(() => {
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
})
