const cache = require('../cache')

module.exports = [{
  method: 'GET',
  path: '/calculate',
  options: {
    handler: async (request, h) => {
      const correlationId = request.query.correlationId

      if (correlationId) {
        const cacheData = await cache.get('calculate', correlationId)
        if (cacheData?.requests && cacheData.requests[cacheData.requests.length - 1]?.response) {
          return h.response({ paymentRates: cacheData.requests[cacheData.requests.length - 1].response }).code(200)
        }
      }
      return h.response(`value for ${correlationId} not in cache, try later`).code(202)
    }
  }
}]
