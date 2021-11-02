const calculateStandards = require('./calculate-standards')
const getParcels = require('../land/get-parcels')
const config = require('../config')
const { get: getCache, update } = require('../cache')
const { getStandardBlobClient } = require('../storage')

const getStandards = async (organisationId, sbi, callerId) => {
  const cachedStandards = await getCache(config.cacheConfig.standardsCache, organisationId)
  if (cachedStandards.standards) {
    return cachedStandards
  }
  const parcels = await getParcels(organisationId, callerId)
  const standards = await calculateStandards(parcels)
  const filename = `${organisationId}.json`
  const blobClient = await getStandardBlobClient(filename)
  const standardsString = JSON.stringify(standards)
  await blobClient.upload(standardsString, standardsString.length)
  const response = {
    organisationId,
    filename,
    storageUrl: blobClient.url,
    standards
  }
  await update(config.cacheConfig.standardsCache, organisationId, response)
  return response
}

module.exports = getStandards
