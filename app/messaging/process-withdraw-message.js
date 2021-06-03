async function processWithdrawMessage (message, receiver) {
  try {
    console.info(`Received withdraw agreement request, correlation Id: ${message.correlationId}`)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processWithdrawMessage
