const cache = require('../cache')
const { getStandards } = require('../standards')

async function processStandardsMessage (message, receiver) {
  try {
    console.info('Received request for available standards')
    const { organisationId, sbi, callerId } = message.body
    await cache.clear('standards', message.correlationId)
    await cache.set('standards', message.correlationId, message.body)
    console.info(`Request for standards stored in cache, correlation Id: ${message.correlationId}`)
    const agreement = await cache.get('agreement', message.correlationId)
    agreement?.agreementNumber ?? await cache.update('agreement', message.correlationId, { agreementNumber: `AG${new Date().getTime()}` })
    const standards = await getStandards(organisationId, sbi, callerId)
    await cache.update('standards', message.correlationId, { standards, agreementNumber: agreement?.agreementNumber })
    console.info(`Response available for standards request, correlation Id: ${message.correlationId}`)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processStandardsMessage
