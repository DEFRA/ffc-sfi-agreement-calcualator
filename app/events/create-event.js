const createEvent = (body, type) => {
  return {
    body,
    type,
    source: 'ffc-sfi-agreement-calculator'
  }
}

module.exports = createEvent
