const cache = require('../cache')
const { getStandards } = require('../standards')
const { isDeepStrictEqual } = require('util')
const { MessageSender } = require('ffc-messaging')
const config = require('../config')

const processStandardsMessage = async (message, receiver) => {
  try {
    const { body, correlationId, messageId } = message
    const { organisationId, sbi, callerId } = message.body
    let standards

    // get cache for current session
    const cacheData = await cache.get('standards', correlationId)

    // ensure an array for all session requests created
    if (!cacheData.requests) {
      cacheData.requests = []
    }

    // if request is unique, add to cache
    if (!cacheData.requests.some(x => isDeepStrictEqual(x.body, body))) {
      cacheData.requests.push({ body })
      await cache.update('standards', correlationId, cacheData)
    }

    // find cache entry for request
    const requestIndex = cacheData.requests.findIndex(x => isDeepStrictEqual(x.body, body))

    // if request already processed then return without reprocessing
    if (!cacheData.requests[requestIndex].standards) {
      console.log(`Processing correlation Id: ${correlationId}, message Id: ${messageId}`)
      standards = await getStandards(organisationId, sbi, callerId)
      cacheData.requests[requestIndex].standards = standards
      await cache.update('standards', correlationId, cacheData)
    } else {
      console.log(`Already processed correlation Id: ${correlationId}, message Id: ${messageId}, skipping`)
      standards = cacheData.requests[requestIndex].standards
    }

    const responseMessage = {
      body: { standards },
      type: 'uk.gov.sfi.agreement.standards.request.response',
      source: 'ffc-sfi-agreement-calculator',
      sessionId: messageId
    }

    const sender = new MessageSender(config.standardsResponseQueue)
    await sender.sendMessage(responseMessage)
    await sender.closeConnection()
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processStandardsMessage
