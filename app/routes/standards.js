const cache = require('../cache')

module.exports = [{
  method: 'GET',
  path: '/standards',
  options: {
    handler: async (request, h) => {
      const correlationId = request.query.correlationId

      if (correlationId) {
        const cacheData = await cache.get('standards', correlationId)
        if (cacheData && cacheData.standards !== undefined) {
          return h.response(cacheData).code(200)
        }
      }
      return h.response(`value for ${correlationId} not in cache, try later`).code(202)
    }
  }
}]
