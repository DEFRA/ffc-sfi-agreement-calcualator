async function processStandardsMessage (message, receiver) {
  try {
    console.info('received request for available standards')
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processStandardsMessage
