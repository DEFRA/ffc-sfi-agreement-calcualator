const { getCachedResponse, setCachedResponse } = require('../cache')
const config = require('../config')
const sendMessage = require('./send-message')
const { getParcelsStandard } = require('../legacy/land')
const util = require('util')
const { fileExists } = require('../storage')

const processParcelStandardMessage = async (message, receiver) => {
  try {
    const { body, messageId } = message
    const { organisationId, sbi, callerId, standardCode } = message.body

    console.log('Parcel standard request received:', util.inspect(message.body, false, null, true))
    let response = await getCachedResponse(config.cacheConfig.parcelStandardCache, body, organisationId)

    if (!response || !fileExists(config.storageConfig.parcelStandardContainer, response.filename)) {
      response = await getParcelsStandard(organisationId, sbi, callerId, standardCode)
      await setCachedResponse(config.cacheConfig.parcelStandardCache, organisationId, body, response)
    }

    await sendMessage(response, 'uk.gov.sfi.agreement.parcel.standard.request.response', config.parcelStandardResponseQueue, { sessionId: messageId })
    await receiver.completeMessage(message)
    console.log('Parcel standards request received:', util.inspect(response, false, null, true))
  } catch (err) {
    console.error('Unable to process parcel standard request message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processParcelStandardMessage
