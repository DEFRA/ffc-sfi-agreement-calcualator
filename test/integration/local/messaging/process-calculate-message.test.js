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

  test('abandons invalid message', async () => {
    message = undefined
    await processCalculateMessage(message, receiver)
    expect(receiver.abandonMessage).toHaveBeenCalledWith(message)
  })
})
