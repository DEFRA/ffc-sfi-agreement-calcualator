const sendMessage = require('./send-message')
const config = require('../config')
const { setCachedResponse, getCachedResponse } = require('../cache')
const util = require('util')
const runValidation = require('../validation')

const processValidateMessage = async (message, receiver) => {
  try {
    const { body, correlationId } = message
    const facts = JSON.parse(JSON.stringify(body))

    console.log('Validation check request received:', util.inspect(message.body, false, null, true))
    const cachedResponse = await getCachedResponse(config.cacheConfig.validateCache, body, correlationId)
    const validationResult = cachedResponse ?? { validationResult: await runValidation(facts) }

    if (!cachedResponse) {
      await setCachedResponse(config.cacheConfig.validateCache, correlationId, body, validationResult)
    }

    await sendMessage(validationResult, 'uk.gov.sfi.validate.result', config.validateResponseTopic, { correlationId })
    await receiver.completeMessage(message)
    console.log('Validation check completed:', util.inspect(validationResult, false, null, true))
  } catch (err) {
    console.error('Unable to process validate message:', err)
  }
}

module.exports = processValidateMessage
