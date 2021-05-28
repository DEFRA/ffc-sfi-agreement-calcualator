module.exports = [{
  method: 'GET',
  path: '/calculate',
  options: {
    handler: async (request, h) => {
      return h.response({
        correlationId: request.query?.correlationId
      })
    }
  }
}]
