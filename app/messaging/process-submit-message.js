
async function processSubmitMessage (message, receiver) {
  try {
    console.info('Received submitted agreement')
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
  }
}

module.exports = processSubmitMessage
