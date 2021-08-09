const sendMessage = require('./send-message')
const config = require('../config')
const { getStandards } = require('../standards')
const getStandardWarnings = require('../standards/get-standard-warnings')

async function processValidateMessage (message, receiver) {
  try {
    console.info(`Request for validation, correlation Id: ${message.correlationId}`)
    const { organisationId, sbi, callerId } = message.body
    const standards = await getStandards(organisationId, sbi, callerId)
    const validationResult = getStandardWarnings(standards)
    await sendMessage({ validationResult }, 'uk.gov.sfi.validate.result', message.correlationId, config.validateResponseTopic)
    console.info(`Response available for validation check, correlation Id: ${message.correlationId}`)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processValidateMessage
