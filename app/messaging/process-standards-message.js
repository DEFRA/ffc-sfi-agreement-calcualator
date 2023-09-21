const getStandards = require('../standards')
const config = require('../config')
const sendMessage = require('./send-message')

const processStandardsMessage = async (message, receiver) => {
  try {
    const { body, messageId } = message
    const { organisationId, sbi, crn, token } = body

    const standardsResponse = await getStandards(organisationId, sbi, crn, token)

    // once funding changes have been updated to use storage in apply for SFI, then this should return the full response object
    await sendMessage({ standards: standardsResponse.standards }, 'uk.gov.sfi.agreement.standards.request.response', config.standardsResponseQueue, { sessionId: messageId })
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process standards request message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processStandardsMessage
