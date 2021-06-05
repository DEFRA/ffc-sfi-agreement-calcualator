const sendMessage = require('./send-message')
const config = require('../config')

async function processWithdrawMessage (message, receiver) {
  try {
    console.info('Received withdraw agreement request')
    await sendMessage(message.body, 'uk.gov.sfi.payment.withdraw', message.correlationId, config.withdrawTopic)
    console.info('Payment withdrawal requested')
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processWithdrawMessage
