module.exports = [{
  method: 'GET',
  path: '/submit',
  options: {
    handler: async (request, h) => {
      return h.response({
        correlationId: request.query?.correlationId
      })
    }
  }
}]
