const { getCachedResponse, setCachedResponse } = require('../cache')
const config = require('../config')
const sendMessage = require('./send-message')
const { getParcelsStandard } = require('../legacy/land')
const util = require('util')

const processParcelStandardMessage = async (message, receiver) => {
  try {
    const { body, messageId } = message
    const { organisationId, sbi, callerId, standardCode } = message.body

    console.log('Parcel standard request received:', util.inspect(message.body, false, null, true))
    const cachedResponse = await getCachedResponse(config.cacheConfig.parcelStandardCache, body, organisationId)
    const parcels = cachedResponse ?? await getParcelsStandard(organisationId, sbi, callerId, standardCode)

    if (!cachedResponse) {
      await setCachedResponse(config.cacheConfig.parcelStandardCache, organisationId, body, parcels)
    }

    await sendMessage(parcels, 'uk.gov.sfi.agreement.parcel.standard.request.response', config.parcelStandardResponseQueue, { sessionId: messageId })
    await receiver.completeMessage(message)
    console.log('Parcel standards request received:', util.inspect(parcels, false, null, true))
  } catch (err) {
    console.error('Unable to process parcel standard request message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processParcelStandardMessage
