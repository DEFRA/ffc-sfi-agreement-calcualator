const cache = require('../cache')
const { calculatePaymentRates } = require('../calculate')
const { isDeepStrictEqual } = require('util')
const { MessageSender } = require('ffc-messaging')
const config = require('../config')

const processCalculateMessage = async (message, receiver) => {
  try {
    const { body, correlationId, messageId } = message
    const { code, parcels } = body
    let response

    // get cache for current session
    const { cacheData, requestIndex } = await getCacheData('calculate', correlationId, body)

    // if request already processed then return without reprocessing
    if (!cacheData.requests[requestIndex].paymentRates) {
      console.log(`Processing correlation Id: ${correlationId}, message Id: ${messageId}`)
      response = calculatePaymentRates(code, parcels)
      cacheData.requests[requestIndex].paymentRates = response
      await cache.update('calculate', correlationId, cacheData)
    } else {
      console.log(`Already processed correlation Id: ${correlationId}, message Id: ${messageId}, skipping`)
      response = cacheData.requests[requestIndex].paymentRates
    }

    const responseMessage = {
      body: { paymentRates: response },
      type: 'uk.gov.sfi.agreement.calculate.response',
      source: 'ffc-sfi-agreement-calculator',
      sessionId: messageId
    }

    const sender = new MessageSender(config.calculateResponseQueue)
    await sender.sendMessage(responseMessage)
    await sender.closeConnection()
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processCalculateMessage

const getCacheData = async (cacheName, correlationId, body) => {
  const cacheData = await cache.get(cacheName, correlationId)

  // ensure an array for all session requests created
  if (!cacheData.requests) {
    cacheData.requests = []
  }

  // if request is unique, add to cache
  if (!cacheData.requests.some(x => isDeepStrictEqual(x.body, body))) {
    cacheData.requests.push({ body })
    await cache.update('calculate', correlationId, cacheData)
  }

  // find cache entry for request
  const requestIndex = cacheData.requests.findIndex(x => isDeepStrictEqual(x.body, body))
  return { cacheData, requestIndex }
}
