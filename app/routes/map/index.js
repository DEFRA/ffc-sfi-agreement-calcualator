const { getParcels } = require('../../api/map')
const config = require('../../config')

module.exports = {
  method: 'GET',
  path: '/map',
  options: {
    handler: async (request, h) => {
      const sbi = request.query.sbi
      const mapStyle = request.query.mapStyle || ''
      const apiKey = config.osMapApiKey || ''
      const { parcels, center } = await getParcels(sbi)
      return h.response({ apiKey, sbi, parcels, center, mapStyle }).code(200)
    }
  }
}
