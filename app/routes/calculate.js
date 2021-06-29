const cache = require('../cache')
const buildResponse = require('../calculation')

module.exports = [{
  method: 'GET',
  path: '/calculate',
  options: {
    handler: async (request, h) => {
      const correlationId = request.query.correlationId

      if (correlationId) {
        const cacheData = await cache.get('calculation', correlationId)
        if (cacheData && cacheData.paymentAmount !== undefined) {
          const calculationresponse = buildResponse(cacheData)
          calculationresponse.correlationId = correlationId
          return h.response(calculationresponse).code(200)
        }
      }
      return h.response(`value for ${correlationId} not in cache, try later`).code(202)
    }
  }
}]
