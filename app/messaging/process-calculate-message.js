const cache = require('../cache')
const calculateAgreement = require('../calculate')

async function processCalculateMessage (message, receiver) {
  try {
    console.info('Received request for calculate')
    await cache.clear('calculate', message.correlationId)
    await cache.set('calculate', message.correlationId, message.body)
    console.info(`Request for calculate stored in cache, correlation Id: ${message.correlationId}`)
    await cache.update('calculate', message.correlationId, { paymentAmount: calculateAgreement(message.body) })
    console.info(`Response available for calculate, correlation Id: ${message.correlationId}`)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processCalculateMessage
