const cache = require('../cache')
const { getEligibility } = require('../api/crown-hosting')

async function processEligibilityMessage (message, receiver) {
  try {
    const sbi = message.body.sbi
    const correlationId = message.correlationId
    console.info('Received request for eligibility check')
    await cache.clear('eligibility', correlationId)
    await cache.set('eligibility', correlationId, message.body)
    console.info(`Request for eligibility check stored in cache, correlation Id: ${correlationId}`)
    const { isEligible, reason } = await getEligibility(sbi)
    await cache.update('eligibility', correlationId, { correlationId, sbi, isEligible, reason })
    console.info(`Response available for eligibility check, correlation Id: ${correlationId}`)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processEligibilityMessage
