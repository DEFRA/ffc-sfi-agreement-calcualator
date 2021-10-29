const processParcelMessage = async (message, receiver) => {
  try {
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process parcel request message:', err)
    await receiver.abandonMessage(message)
  }
}

module.exports = processParcelMessage
