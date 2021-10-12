const pactServiceBusAdapter = (handler) => {
  return (message) => {
    message.body = JSON.stringify(message.contents)
    return handler(message, { completeMessage: jest.fn(), abandonMessage: jest.fn() })
  }
}
module.exports = pactServiceBusAdapter
