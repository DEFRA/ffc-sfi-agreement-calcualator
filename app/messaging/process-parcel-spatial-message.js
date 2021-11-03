const { getParcelsSpatial, getParcelsStandard } = require('../land')
const config = require('../config')
const sendMessage = require('./send-message')

const processParcelSpatialMessage = async (message, receiver) => {
  try {
    const { body, messageId } = message
    const { organisationId, sbi, callerId } = body

    const parcelResponse = await getParcelsSpatial(organisationId, sbi, callerId)
    // get standards and spatial data for organisation ready for next steps in journey
    getParcelsStandard(organisationId, sbi, callerId)

    await sendMessage(parcelResponse, 'uk.gov.sfi.agreement.parcel.spatial.request.response', config.parcelSpatialResponseQueue, { sessionId: messageId })
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process parcel spatial request message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processParcelSpatialMessage
