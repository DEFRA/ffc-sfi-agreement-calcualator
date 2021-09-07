const createMessage = (body, type, correlationId) => {
  return {
    body,
    type,
    source: 'ffc-sfi-agreement-calculator',
    correlationId
  }
}

module.exports = createMessage
