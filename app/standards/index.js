const calculateStandards = require('./calculate-standards')
const getParcels = require('../legacy/land/get-parcels')
const config = require('../config')
const { get: getCache, update } = require('../cache')
const { getBlobClient, fileExists } = require('../storage')

const getStandards = async (organisationId, sbi, crn, token) => {
  const filename = `${organisationId}.json`

  const cachedStandards = await getCache(config.cacheConfig.standardsCache, organisationId)
  if (cachedStandards.standards && await fileExists(config.storageConfig.standardContainer, filename)) {
    return cachedStandards
  }
  const parcels = await getParcels(organisationId, crn, token)
  const standards = await calculateStandards(sbi, parcels)
  const blobClient = await getBlobClient(config.storageConfig.standardContainer, filename)
  const standardsString = JSON.stringify(standards)
  await blobClient.upload(standardsString, standardsString.length)
  const response = {
    organisationId,
    filename,
    standards
  }
  await update(config.cacheConfig.standardsCache, organisationId, response)
  return response
}

module.exports = getStandards
