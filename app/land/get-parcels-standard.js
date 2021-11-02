const getStandards = require('../standards')
const { getParcelStandardBlobClient, downloadParcelSpatialFile } = require('../storage')
const getParcelsSpatial = require('./get-parcels-spatial')

const getParcelsStandard = async (organisationId, sbi, callerId, standardCode) => {
  const parcelsResponse = await getParcelsSpatial(organisationId, sbi, callerId)
  const standardsResponse = await getStandards(organisationId, sbi, callerId)
  const parcelSpatial = await downloadParcelSpatialFile(parcelsResponse.filename)
  const standard = standardsResponse.standards?.find(x => x.code === standardCode) ?? { code: standardCode, parcels: [] }
  standard.spatial = JSON.parse(parcelSpatial)
  standard.spatial.features = standard.spatial.features.filter(x => standard.parcels.some(y => y.id === `${x.sheet_id}${x.parcel_id}`))

  const filename = `${organisationId}-${standardCode}.json`
  const blobClient = await getParcelStandardBlobClient(filename)
  const standardsString = JSON.stringify(standard)
  await blobClient.upload(standardsString, standardsString.length)

  return {
    organisationId,
    filename,
    storageUrl: blobClient.url
  }
}

module.exports = getParcelsStandard
