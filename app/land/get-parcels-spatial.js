const { get } = require('../api/private')
const config = require('../config')
const { get: getCache, update } = require('../cache')

const getParcelsSpatial = async (organisationId, sbi) => {
  const cachedParcels = await getCache(config.cacheConfig.parcelSpatialCache, organisationId)
  if (cachedParcels.parcels) {
    return cachedParcels.parcels
  }
  const parcels = await get(`/LandParcels/MapServer/0/query?where=SBI=${sbi}&outFields=*&outSR=27700&f=geojson`)
  await update(config.cacheConfig.parcelSpatialCache, organisationId, parcels)
  return parcels
}

module.exports = getParcelsSpatial
