const { getCachedResponse, setCachedResponse } = require('../cache')
const calculatePaymentRates = require('../calculate')
const config = require('../config')
const sendMessage = require('./send-message')
const util = require('util')

const processCalculateMessage = async (message, receiver) => {
  try {
    const { body, correlationId, messageId } = message
    const { code, landCovers, calculateDate } = body

    console.log('Calculation request received:', util.inspect(message.body, false, null, true))
    const cachedResponse = await getCachedResponse(config.cacheConfig.calculateCache, body, correlationId)
    const paymentRates = cachedResponse ?? await calculatePaymentRates(code, landCovers, calculateDate)

    if (!cachedResponse) {
      await setCachedResponse(config.cacheConfig.calculateCache, correlationId, body, paymentRates)
    }

    await sendMessage(paymentRates, 'uk.gov.sfi.agreement.calculate.response', config.calculateResponseQueue, { sessionId: messageId })
    await receiver.completeMessage(message)
    console.log('Calculation request completed:', util.inspect(paymentRates, false, null, true))
  } catch (err) {
    console.error('Unable to process calculate message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processCalculateMessage
