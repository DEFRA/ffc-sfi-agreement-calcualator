const cache = require('../cache')
const isEligible = require('../eligibility')

async function processEligibilityMessage (message, receiver) {
  try {
    console.info('Received request for eligibility check')
    await cache.clear('eligibility', message.correlationId)
    await cache.set('eligibility', message.correlationId, message.body)
    console.info(`Request for eligibility check stored in cache, correlation Id: ${message.correlationId}`)
    await cache.update('eligibility', message.correlationId, { isEligible: isEligible(message.body.sbi) })
    console.info(`Response available for eligibility check, correlation Id: ${message.correlationId}`)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processEligibilityMessage
