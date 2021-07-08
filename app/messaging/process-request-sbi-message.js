const api = require('../api')

async function processRequestSBIMessage (message, receiver) {
  try {
    console.info('Received request SBI request', message.body)
    await api.post('/request-sbi', message.body)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
  }
}

module.exports = processRequestSBIMessage
