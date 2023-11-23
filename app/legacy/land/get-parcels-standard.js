const getStandards = require('../../standards')
const { getBlobClient, downloadFile } = require('../../storage')
const getParcelsSpatial = require('./get-parcels-spatial')
const config = require('../../config').storageConfig

const getParcelsStandard = async (organisationId, sbi, crn, token, standardCode) => {
  const parcelsResponse = await getParcelsSpatial(organisationId, sbi, crn, token)
  const standardsResponse = await getStandards(organisationId, sbi, crn, token)
  const parcelSpatial = await downloadFile(config.parcelSpatialContainer, parcelsResponse.filename)
  const standard = standardsResponse.standards?.find(x => x.code === standardCode) ?? { code: standardCode, landCovers: [] }
  standard.spatial = JSON.parse(parcelSpatial)
  standard.spatial.features = standard.spatial.features.filter(x => standard.landCovers.some(y => y.parcelId === `${x.properties.sheetId}${x.properties.parcelId}`))

  const filename = `${organisationId}-${standardCode}.json`
  const blobClient = await getBlobClient(config.parcelStandardContainer, filename)
  const standardsString = JSON.stringify(standard)
  await blobClient.upload(standardsString, standardsString.length)

  return {
    organisationId,
    filename
  }
}

module.exports = getParcelsStandard
