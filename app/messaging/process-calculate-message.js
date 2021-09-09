const { getCachedResponse, setCachedResponse } = require('../cache')
const { calculatePaymentRates } = require('../calculate')
const config = require('../config')
const sendMessage = require('./send-message')

const processCalculateMessage = async (message, receiver) => {
  try {
    const { body, correlationId, messageId } = message
    const { code, parcels } = body

    const cachedResponse = await getCachedResponse('calculate', body, correlationId)
    const paymentRates = cachedResponse ?? calculatePaymentRates(code, parcels)

    if (!cachedResponse) {
      await setCachedResponse('calculate', correlationId, body, paymentRates)
    }

    await sendMessage(paymentRates, 'uk.gov.sfi.agreement.calculate.response', undefined, messageId, config.calculateResponseQueue)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processCalculateMessage
