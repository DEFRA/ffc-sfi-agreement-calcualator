const cache = require('../cache')

const mockSBIPayload = {
  sbis: ['106336339', '106651310']
}

async function processRequestSBIMessage (message, receiver) {
  try {
    const correlationId = message.correlationId
    console.info('Received request SBI request', message.body)
    await cache.clear('request-sbi', correlationId)
    await cache.set('request-sbi', correlationId, message.body)
    console.info(`Request for SBIs from CRN stored in cache, correlation Id: ${correlationId}`)
    const payload = mockSBIPayload
    await cache.update('request-sbi', correlationId, { ...payload, correlationId })
    console.info(`Response available for request-sbi, correlation Id: ${correlationId}`)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
  }
}

module.exports = processRequestSBIMessage
