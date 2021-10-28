const { getCachedResponse, setCachedResponse } = require('../cache')
const getParcelsSpatial = require('../land/get-parcels-spatial')
const config = require('../config')
const sendMessage = require('./send-message')

const processParcelMessage = async (message, receiver) => {
  try {
    const { body, correlationId, messageId } = message
    const { organisationId, sbi, callerId } = message.body

    const cachedResponse = await getCachedResponse(config.cacheConfig.parcelSpatialCache, body, correlationId)
    const parcels = cachedResponse ?? await getParcelsSpatial(organisationId, sbi, callerId)

    if (!cachedResponse) {
      await setCachedResponse(config.cacheConfig.parcelSpatialCache, correlationId, body, parcels)
    }

    await sendMessage(parcels, 'uk.gov.sfi.agreement.parcel.request.response', config.parcelResponseQueue, { sessionId: messageId })
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process parcel request message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processParcelMessage
