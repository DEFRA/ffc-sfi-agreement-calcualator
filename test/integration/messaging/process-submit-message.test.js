const db = require('../../../app/data')
const processSubmitMessage = require('../../../app/messaging/process-submit-message')
let receiver
let message

describe('process submit message', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })
    receiver = {
      completeMessage: jest.fn(),
      abandonMessage: jest.fn()
    }

    message = {
      body: {
        sbi: 123456789,
        agreementNumber: 'AG12345678',
        agreement: {
          paymentAmount: 100
        }
      }
    }
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('completes valid message', async () => {
    await processSubmitMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('does not abandon invalid message', async () => {
    message = undefined
    await processSubmitMessage(message, receiver)
    expect(receiver.abandonMessage).not.toHaveBeenCalledWith(message)
  })
})
