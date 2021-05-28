async function processSubmitMessage (message, receiver) {
  try {
    console.info('received submitted agreement')
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processSubmitMessage
