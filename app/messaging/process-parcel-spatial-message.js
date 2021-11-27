const { getParcelsSpatial, getParcelsStandard } = require('../legacy/land')
const config = require('../config')
const sendMessage = require('./send-message')
const util = require('util')

const processParcelSpatialMessage = async (message, receiver) => {
  try {
    const { body, messageId } = message
    const { organisationId, sbi, callerId } = body

    console.log('Parcel spatial request received:', util.inspect(message.body, false, null, true))
    const parcelResponse = await getParcelsSpatial(organisationId, sbi, callerId)
    // get standards and spatial data for organisation ready for next steps in journey
    getParcelsStandard(organisationId, sbi, callerId, 'sfi-arable-soil').catch(err => console.error('Unable to map standards to parcels:', err))
    getParcelsStandard(organisationId, sbi, callerId, 'sfi-improved-grassland').catch(err => console.error('Unable to map standards to parcels:', err))

    await sendMessage(parcelResponse, 'uk.gov.sfi.agreement.parcel.spatial.request.response', config.parcelSpatialResponseQueue, { sessionId: messageId })
    await receiver.completeMessage(message)
    console.log('Parcel spatial request completed:', util.inspect(parcelResponse, false, null, true))
  } catch (err) {
    console.error('Unable to process parcel spatial request message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processParcelSpatialMessage
