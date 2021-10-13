const pactServiceBusAdapter = (handler, receiver) => {
  return (message) => {
    message.body = JSON.stringify(message.contents)
    return handler(message, receiver)
  }
}
module.exports = pactServiceBusAdapter
