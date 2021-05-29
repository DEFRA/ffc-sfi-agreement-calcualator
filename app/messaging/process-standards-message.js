async function processStandardsMessage (message, receiver) {
  try {
    console.info(`Received request for available standards, correlation Id: ${message.correlationId}`)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processStandardsMessage
