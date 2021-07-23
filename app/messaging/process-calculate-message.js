const cache = require('../cache')
const { calculatePaymentRates } = require('../calculate')

async function processCalculateMessage (message, receiver) {
  try {
    console.info('Received request for calculate')
    const { body, correlationId } = message
    const { code, parcels } = body
    await cache.clear('calculate', correlationId)
    await cache.set('calculate', correlationId, body)
    console.info(`Request for calculate stored in cache, correlation Id: ${correlationId}`)
    const paymentRates = calculatePaymentRates(code, parcels)
    await cache.update('calculate', correlationId, { paymentRates })
    console.info(`Response available for calculate, correlation Id: ${message}`)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processCalculateMessage
