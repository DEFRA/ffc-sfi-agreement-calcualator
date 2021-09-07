const { createAgreement } = require('../submit')

const processSubmitMessage = async (message, receiver) => {
  try {
    await createAgreement(message.body)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
  }
}

module.exports = processSubmitMessage
