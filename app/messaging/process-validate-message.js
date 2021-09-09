const sendMessage = require('./send-message')
const config = require('../config').validateResponseTopic
const { getStandards } = require('../standards')
const getStandardWarnings = require('../standards/get-standard-warnings')

const processValidateMessage = async (message, receiver) => {
  try {
    const { body, correlationId } = message
    const { organisationId, sbi, callerId } = body
    const standards = await getStandards(organisationId, sbi, callerId)
    const validationResult = getStandardWarnings(standards)
    await sendMessage({ validationResult }, 'uk.gov.sfi.validate.result', config, { correlationId })
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processValidateMessage
