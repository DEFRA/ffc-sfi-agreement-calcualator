const cache = require('../cache')
const buildResponse = require('../calculate')

module.exports = [{
  method: 'GET',
  path: '/calculate',
  options: {
    handler: async (request, h) => {
      const correlationId = request.query.correlationId

      if (correlationId) {
        const cacheData = await cache.get('calculate', correlationId)
        if (cacheData && cacheData.paymentAmount !== undefined) {
          const calculateResponse = buildResponse(cacheData)
          calculateResponse.correlationId = correlationId
          return h.response(calculateResponse).code(200)
        }
      }
      return h.response(`value for ${correlationId} not in cache, try later`).code(202)
    }
  }
}]
