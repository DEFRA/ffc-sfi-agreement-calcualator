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
const processValidateMessage = require('../../../app/messaging/process-validate-message')
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

describe('process validate message', () => {
  beforeAll(async () => {
    await cache.start()
  })

  beforeEach(async () => {
    await cache.flushAll()
    receiver = {
      completeMessage: jest.fn(),
      abandonMessage: jest.fn()
    }

    message = {
      correlationId: 'correlationId',
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

  afterAll(async () => {
    await cache.flushAll()
    await cache.stop()
  })

  test('completes valid message', async () => {
    await processValidateMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('sends message if valid', async () => {
    await processValidateMessage(message, receiver)
    expect(mockSendMessage).toHaveBeenCalled()
  })

  test('sends message with result', async () => {
    await processValidateMessage(message, receiver)
    expect(mockSendMessage.mock.calls[0][0].body.validationResult).toBeDefined()
  })

  test('does not abandon invalid message', async () => {
    message = undefined
    await processValidateMessage(message, receiver)
    expect(receiver.abandonMessage).not.toHaveBeenCalledWith(message)
  })

  test('sets cache if no cached result', async () => {
    await processValidateMessage(message, receiver)
    const result = await cache.get('validate', 'correlationId')
    expect(result.requests).toBeDefined()
  })

  test('adds request to cache', async () => {
    await processValidateMessage(message, receiver)
    const result = await cache.get('validate', 'correlationId')
    expect(result.requests[0].request).toStrictEqual(message.body)
  })

  test('does not update cache if duplicate message', async () => {
    await processValidateMessage(message, receiver)
    await processValidateMessage(message, receiver)
    const result = await cache.get('validate', 'correlationId')
    expect(result.requests[0].request).toStrictEqual(message.body)
    expect(result.requests.length).toBe(1)
  })

  test('updates cache if new message', async () => {
    await processValidateMessage(message, receiver)
    message.body.sbi = 123456788
    await processValidateMessage(message, receiver)
    const result = await cache.get('validate', 'correlationId')
    expect(result.requests.length).toBe(2)
  })
})
