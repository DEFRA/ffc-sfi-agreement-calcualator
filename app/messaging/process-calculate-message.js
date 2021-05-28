async function processCalculateMessage (message, receiver) {
  try {
    console.info('received request for calculation')
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processCalculateMessage
