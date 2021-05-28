async function processEligibilityMessage (message, receiver) {
  try {
    console.info('received request for eligibility check')
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processEligibilityMessage
