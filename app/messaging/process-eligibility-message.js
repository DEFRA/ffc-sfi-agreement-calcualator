const { getCachedResponse, setCachedResponse } = require('../cache')
const getEligibility = require('../eligibility')
const config = require('../config')
const sendMessage = require('./send-message')

const processEligibilityMessage = async (message, receiver) => {
  try {
    const { body, correlationId, messageId } = message
    const { organisationId, sbi, callerId } = message.body

    const cachedResponse = await getCachedResponse(config.cacheConfig.eligibilityCache, body, correlationId)
    const eligibility = cachedResponse ?? { eligibility: await getEligibility(organisationId, sbi, callerId) }

    if (!cachedResponse) {
      await setCachedResponse(config.cacheConfig.eligibilityCache, correlationId, body, eligibility)
    }

    await sendMessage(eligibility, 'uk.gov.sfi.agreement.eligibility.request.response', config.eligibilityCheckResponseQueue, { sessionId: messageId })
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processEligibilityMessage
