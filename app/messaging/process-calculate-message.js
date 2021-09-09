const cache = require('../cache')
const { calculatePaymentRates } = require('../calculate')
const config = require('../config')
const sendMessage = require('./send-message')

const processCalculateMessage = async (message, receiver) => {
  try {
    const { body, correlationId, messageId } = message
    const { code, parcels } = body

    const cachedResponse = await cache.getCachedResponse('calculate', body, correlationId)

    // if request already processed then return without reprocessing
    if (cachedResponse) {
      await sendMessage(cachedResponse, 'uk.gov.sfi.agreement.calculate.response', undefined, messageId, config.calculateResponseQueue)
    } else {
      const paymentRates = calculatePaymentRates(code, parcels)
      await cache.updateCache('calculate', correlationId, body, paymentRates)
      await sendMessage(paymentRates, 'uk.gov.sfi.agreement.calculate.response', undefined, messageId, config.calculateResponseQueue)
    }
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processCalculateMessage
