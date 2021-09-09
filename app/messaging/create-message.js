const createMessage = (body, type, correlationId, sessionId) => {
  return {
    body,
    type,
    source: 'ffc-sfi-agreement-calculator',
    correlationId,
    sessionId
  }
}

module.exports = createMessage
