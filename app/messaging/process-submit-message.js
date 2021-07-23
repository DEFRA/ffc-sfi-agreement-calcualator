const { createAgreement } = require('../submit')

async function processSubmitMessage (message, receiver) {
  try {
    console.info('Received submitted agreement')
    const { correlationId } = message
    console.info(`Creating agreement for, correlation Id: ${correlationId}`)
    await createAgreement(message)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
  }
}

module.exports = processSubmitMessage
