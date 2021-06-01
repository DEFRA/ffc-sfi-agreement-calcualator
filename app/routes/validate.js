module.exports = [{
  method: 'GET',
  path: '/validate',
  options: {
    handler: async (request, h) => {
      return h.response({
        correlationId: request.query?.correlationId
      })
    }
  }
}]
