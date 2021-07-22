const cache = require('../cache')
const validationResponse = require('../validation')
const sendMessage = require('./send-message')
const config = require('../config')

async function processValidateMessage (message, receiver) {
  try {
    console.info('Received request for validation')
    await cache.clear('validation', message.correlationId)
    await cache.set('validation', message.correlationId, message.body)
    console.info(`Request for validation stored in cache, correlation Id: ${message.correlationId}`)
    const validationResult = validationResponse(message.body, message.correlationId)
    await cache.update('validation', message.correlationId, validationResult)
    await sendMessage(validationResult, 'uk.gov.sfi.validate.result', message.correlationId, config.validateResponseTopic)
    console.info(`Response available for validation check, correlation Id: ${message.correlationId}`)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processValidateMessage
