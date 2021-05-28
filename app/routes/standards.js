module.exports = [{
  method: 'GET',
  path: '/standards',
  options: {
    handler: async (request, h) => {
      return h.response({
        correlationId: request.query?.correlationId
      })
    }
  }
}]
