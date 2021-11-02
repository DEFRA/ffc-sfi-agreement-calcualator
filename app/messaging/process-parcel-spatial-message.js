const getParcelsSpatial = require('../land/get-parcels-spatial')
const config = require('../config')
const sendMessage = require('./send-message')
const getStandards = require('../standards')

const processParcelSpatialMessage = async (message, receiver) => {
  try {
    const { body, messageId } = message
    const { organisationId, sbi, callerId } = body

    const parcels = await getParcelsSpatial(organisationId, sbi, callerId)
    // get standards for organisation ready for next request
    getStandards(organisationId, sbi, callerId)

    await sendMessage(parcels, 'uk.gov.sfi.agreement.parcel.spatial.request.response', config.parcelSpatialResponseQueue, { sessionId: messageId })
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process parcel spatial request message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processParcelSpatialMessage
