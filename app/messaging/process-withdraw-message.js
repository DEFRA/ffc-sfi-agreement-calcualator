const processWithdrawMessage = async (message, receiver) => {
  try {
    console.info('Received withdraw agreement request')
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
  }
}

module.exports = processWithdrawMessage
