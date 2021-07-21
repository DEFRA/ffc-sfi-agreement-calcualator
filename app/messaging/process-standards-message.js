const cache = require('../cache')
const { getStandards } = require('../standards')

async function processStandardsMessage (message, receiver) {
  try {
    const { organisationId, sbi, callerId } = message.body
    console.info('Received request for available standards')
    await cache.clear('standards', message.correlationId)
    await cache.set('standards', message.correlationId, message.body)
    console.info(`Request for standards stored in cache, correlation Id: ${message.correlationId}`)
    const standards = await getStandards(organisationId, sbi, callerId)
    await cache.update('standards', message.correlationId, { standards })
    console.info(`Response available for standards request, correlation Id: ${message.correlationId}`)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processStandardsMessage
