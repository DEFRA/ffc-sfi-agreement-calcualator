const cache = require('../cache')
const api = require('../api')

async function processRequestSBIMessage (message, receiver) {
  try {
    const correlationId = message.correlationId
    console.info('Received request SBI request', message.body)
    await cache.clear('request-sbi', correlationId)
    await cache.set('request-sbi', correlationId, message.body)
    console.info(`Request for SBIs from CRN stored in cache, correlation Id: ${correlationId}`)
    const payload = await api.post('/request-sbi', message.body)
    await cache.update('request-sbi', correlationId, { ...payload, correlationId })
    console.info(`Response available for request-sbi, correlation Id: ${correlationId}`)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
  }
}

module.exports = processRequestSBIMessage
