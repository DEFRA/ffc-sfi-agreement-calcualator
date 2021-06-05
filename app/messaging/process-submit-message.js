const sendMessage = require('./send-message')
const config = require('../config')

async function processSubmitMessage (message, receiver) {
  try {
    console.info('Received submitted agreement')
    await sendMessage(message.body, 'uk.gov.sfi.payment.request', message.correlationId, config.paymentTopic)
    console.info('Payment requested')
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processSubmitMessage
