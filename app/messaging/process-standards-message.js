const { getCachedResponse, setCachedResponse } = require('../cache')
const { getStandards } = require('../standards')
const config = require('../config')
const sendMessage = require('./send-message')

const processStandardsMessage = async (message, receiver) => {
  try {
    const { body, correlationId, messageId } = message
    const { organisationId, sbi, callerId } = message.body

    const cachedResponse = await getCachedResponse('standards', body, correlationId)
    const standards = cachedResponse ?? { standards: await getStandards(organisationId, sbi, callerId) }

    if (!cachedResponse) {
      await setCachedResponse('standards', correlationId, body, standards)
    }

    await sendMessage(standards, 'uk.gov.sfi.agreement.standards.request.response', undefined, messageId, config.standardsResponseQueue)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processStandardsMessage
