const processWithdrawMessage = require('../../../app/messaging/process-withdraw-message')
let receiver
let message

describe('process withdraw message', () => {
  beforeEach(async () => {
    receiver = {
      completeMessage: jest.fn(),
      abandonMessage: jest.fn()
    }

    message = {
      body: {
        agreementNumber: 'AG12345678'
      }
    }
  })

  test('completes valid message', async () => {
    await processWithdrawMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('does not abandon invalid message', async () => {
    message = undefined
    await processWithdrawMessage(message, receiver)
    expect(receiver.abandonMessage).not.toHaveBeenCalledWith(message)
  })
})
