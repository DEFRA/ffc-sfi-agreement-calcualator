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
const processStandardsMessage = require('../../../../app/messaging/process-standards-message')
jest.mock('../../../../app/api', () => {
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
jest.mock('../../../../app/cache')
const mockCache = require('../../../../app/cache')
let receiver
let message

describe('process standards message', () => {
  beforeEach(async () => {
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

  afterEach(() => {
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

  test('processes and sets cache if no cached result', async () => {
    await processStandardsMessage(message, receiver)
    expect(mockCache.setCachedResponse).toHaveBeenCalled()
  })

  test('does not process and set cache if cached result', async () => {
    mockCache.getCachedResponse.mockReturnValue(true)
    await processStandardsMessage(message, receiver)
    expect(mockCache.setCachedResponse).not.toHaveBeenCalled()
  })
})
