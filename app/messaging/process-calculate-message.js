const cache = require('../cache')
const { calculatePaymentRates } = require('../calculate')

const processCalculateMessage = async (message, receiver) => {
  try {
    const { body, correlationId } = message
    const { code, parcels } = body
    await cache.clear('calculate', correlationId)
    await cache.set('calculate', correlationId, body)
    const paymentRates = calculatePaymentRates(code, parcels)
    await cache.update('calculate', correlationId, { paymentRates })
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processCalculateMessage
