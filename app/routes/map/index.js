const { getParcels } = require('../../api/map')

module.exports = {
  method: 'GET',
  path: '/map',
  options: {
    handler: async (request, h) => {
      const sbi = request.query.sbi
      const { parcels, center } = await getParcels(sbi)
      return h.response({ sbi, parcels, center }).code(200)
    }
  }
}
