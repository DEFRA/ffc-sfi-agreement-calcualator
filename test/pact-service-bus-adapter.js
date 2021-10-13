const pactServiceBusAdapter = (handler, receiver) => {
  return (message) => {
    message.body = message.contents
    message.correlationId = message.metadata['correlation-id']
    message.messageId = message.metadata['message-id']
    return new Promise((resolve, reject) => {
      try {
        const result = handler(message, receiver)
        resolve(result)
      } catch (err) {
        reject(err)
      }
    })
  }
}
module.exports = pactServiceBusAdapter
