const sendMessage = require('./send-message')
const config = require('../config')
const { getStandards } = require('../standards')
const getStandardWarnings = require('../standards/get-standard-warnings')
const { setCachedResponse, getCachedResponse } = require('../cache')

const processValidateMessage = async (message, receiver) => {
  try {
    const { body, correlationId } = message
    const { organisationId, sbi, callerId } = body

    const cachedResponse = await getCachedResponse(config.cacheConfig.validationCache, body, correlationId)
    const validationResult = cachedResponse ?? (async () => {
      const standards = await getStandards(organisationId, sbi, callerId)
      return getStandardWarnings(standards)
    })

    if (!cachedResponse) {
      await setCachedResponse(config.cacheConfig.validationCache, correlationId, body, validationResult)
    }

    await sendMessage(validationResult, 'uk.gov.sfi.validate.result', config.validateResponseTopic, { correlationId })

    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processValidateMessage
