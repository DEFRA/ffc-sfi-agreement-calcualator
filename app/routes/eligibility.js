module.exports = [{
  method: 'GET',
  path: '/eligibility',
  options: {
    handler: async (request, h) => {
      return h.response({
        correlationId: request.query?.correlationId
      })
    }
  }
}]
