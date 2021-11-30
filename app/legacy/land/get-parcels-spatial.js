const { get } = require('../../api/public')
const config = require('../../config')
const { get: getCache, update } = require('../../cache')
const { getBlobClient, fileExists } = require('../../storage')

const getParcelsSpatial = async (organisationId, sbi, callerId) => {
  const filename = `${organisationId}.json`

  const cachedResponse = await getCache(config.cacheConfig.parcelSpatialCache, organisationId)
  if (cachedResponse.filename && fileExists(config.storageConfig.parcelSpatialContainer, filename)) {
    console.log('Cached file exists in storage')
    return cachedResponse
  }

  const parcels = await get(`/arcgis/rest/services/RPA/LandParcels/MapServer/0/query?where=SBI=${sbi}&outFields=*&outSR=27700&f=geojson`)
  const parcelString = JSON.stringify(parcels)
  const blobClient = await getBlobClient(config.storageConfig.parcelSpatialContainer, filename)
  await blobClient.upload(parcelString, parcelString.length)
  const response = {
    organisationId,
    filename
  }
  await update(config.cacheConfig.parcelSpatialCache, organisationId, response)
  console.log('Created file and updated cache')
  return response
}

module.exports = getParcelsSpatial
