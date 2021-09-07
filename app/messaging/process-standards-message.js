const cache = require('../cache')
const { getStandards } = require('../standards')

const processStandardsMessage = async (message, receiver) => {
  try {
    const { organisationId, sbi, callerId } = message.body
    await cache.clear('standards', message.correlationId)
    await cache.set('standards', message.correlationId, message.body)
    const standards = await getStandards(organisationId, sbi, callerId)
    await cache.update('standards', message.correlationId, { standards })
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processStandardsMessage
