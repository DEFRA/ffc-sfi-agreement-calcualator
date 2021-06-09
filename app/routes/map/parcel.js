const { getParcelCovers } = require('../../api/map')
const config = require('../../config')

module.exports = {
  method: 'GET',
  path: '/parcel',
  options: {
    handler: async (request, h) => {
      const { sbi, sheetId, parcelId } = request.query
      let { mapStyle } = request.query
      const apiKey = config.osMapApiKey || ''
      mapStyle = mapStyle || ''
      const { parcels, center, totalArea, covers } = await getParcelCovers(sbi, sheetId, parcelId)
      return h.response({ apiKey, sbi, sheetId, parcelId, parcels, center, totalArea, covers, mapStyle }).code(200)
    }
  }
}
