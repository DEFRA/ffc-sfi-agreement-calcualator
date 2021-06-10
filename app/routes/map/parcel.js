const { getParcelCovers } = require('../../api/map')

module.exports = {
  method: 'GET',
  path: '/parcel',
  options: {
    handler: async (request, h) => {
      const { sbi, sheetId, parcelId, description } = request.query
      const { parcels, center, totalArea, covers } = await getParcelCovers(sbi, sheetId, parcelId, description)
      return h.response({ sbi, sheetId, parcelId, parcels, center, totalArea, covers, description }).code(200)
    }
  }
}
