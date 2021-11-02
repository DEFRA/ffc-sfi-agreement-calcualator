const { get } = require('../api/public')
const config = require('../config')
const { get: getCache, update } = require('../cache')
const { getParcelSpatialBlobClient } = require('../storage')

const getParcelsSpatial = async (organisationId, sbi, callerId) => {
  const cachedResponse = await getCache(config.cacheConfig.parcelSpatialCache, organisationId)
  if (cachedResponse.filename) {
    return cachedResponse
  }
  const parcels = await get(`/LandParcels/MapServer/0/query?where=SBI=${sbi}&outFields=*&outSR=27700&f=geojson`)
  const filename = `${organisationId}.json`
  const blobClient = await getParcelSpatialBlobClient(filename)
  const parcelString = JSON.stringify(parcels)
  await blobClient.upload(parcelString, parcelString.length)
  const response = {
    organisationId,
    filename,
    storageUrl: blobClient.url
  }
  await update(config.cacheConfig.parcelSpatialCache, organisationId, response)
  return response
}

module.exports = getParcelsSpatial