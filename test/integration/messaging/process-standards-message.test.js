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
jest.mock('../../../app/api/private', () => {
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
const db = require('../../../app/data')
let scheme
let standard
let landCover
let standardLandCover
let receiver
let message

describe('process standards message', () => {
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

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
    await cache.flushAll()
    await cache.stop()
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
    const result = await cache.get('standards', 1)
    expect(result.standards).toBeDefined()
  })
})
