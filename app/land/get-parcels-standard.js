const getStandards = require('../standards')
const { getParcelStandardBlobClient, downloadParcelSpatialFile } = require('../storage')
const getParcelsSpatial = require('./get-parcels-spatial')

const getParcelsStandard = async (organisationId, sbi, callerId) => {
  const parcelsResponse = await getParcelsSpatial(organisationId, sbi)
  const standardsResponse = await getStandards(organisationId, sbi, callerId)
  const parcels = await downloadParcelSpatialFile(parcelsResponse.filename)
  for (const standard of standardsResponse.standards) {
    standard.spatial = JSON.parse(parcels)
    standard.spatial.features = standard.spatial.features.filter(x => standard.parcels.some(y => y.id === `${x.sheet_id}${x.parcel_id}`))
  }

  const filename = `${organisationId}.json`
  const blobClient = await getParcelStandardBlobClient(filename)
  const standardsString = JSON.stringify(standardsResponse.standards)
  await blobClient.upload(standardsString, standardsString.length)
  return {
    organisationId,
    filename,
    storageUrl: blobClient.url
  }
}

module.exports = getParcelsStandard
