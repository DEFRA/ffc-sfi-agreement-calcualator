const { getCachedResponse, setCachedResponse } = require('../cache')
const config = require('../config')
const sendMessage = require('./send-message')
const getParcelsStandard = require('../land/get-parcels-standard')

const processParcelStandardMessage = async (message, receiver) => {
  try {
    const { body, correlationId, messageId } = message
    const { organisationId, sbi, callerId } = message.body

    const cachedResponse = await getCachedResponse(config.cacheConfig.parcelStandardCache, body, correlationId)
    const parcels = cachedResponse ?? await getParcelsStandard(organisationId, sbi, callerId)

    if (!cachedResponse) {
      await setCachedResponse(config.cacheConfig.parcelStandardCache, correlationId, body, parcels)
    }

    await sendMessage(parcels, 'uk.gov.sfi.agreement.parcel.standard.request.response', config.parcelStandardResponseQueue, { sessionId: messageId })
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process parcel standard request message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processParcelStandardMessage
