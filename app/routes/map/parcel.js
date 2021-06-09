const { getParcelCovers } = require('../../api/map')

module.exports = {
  method: 'GET',
  path: '/parcel',
  options: {
    handler: async (request, h) => {
      const { sbi, sheetId, parcelId } = request.query
      const { parcels, center, totalArea, covers } = await getParcelCovers(sbi, sheetId, parcelId)
      return h.response({ sbi, sheetId, parcelId, parcels, center, totalArea, covers }).code(200)
    }
  }
}
