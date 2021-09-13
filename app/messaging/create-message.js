const createMessage = (body, type, options) => {
  return {
    body,
    type,
    source: 'ffc-sfi-agreement-calculator',
    ...options
  }
}

module.exports = createMessage
