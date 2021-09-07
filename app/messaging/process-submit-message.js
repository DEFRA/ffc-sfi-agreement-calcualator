const { createAgreement } = require('../submit')

async function processSubmitMessage (message, receiver) {
  try {
    await createAgreement(message.body)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
  }
}

module.exports = processSubmitMessage
