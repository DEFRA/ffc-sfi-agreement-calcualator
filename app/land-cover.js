const { get } = require('./api')
const { convertMetresToHectares } = require('./conversion')
const config = require('./config')
const { get: getCache, update } = require('./cache')
const bpsIneligibleFeatureCode = '000'

const getParcels = async (organisationId, callerId) => {
  const cachedParcels = await getCache(config.cacheConfig.parcelCache, organisationId)
  if (cachedParcels.parcels) {
    return cachedParcels
  }
  const parcels = await get(`/lms/organisation/${organisationId}/land-covers`, callerId)
  await update(config.cacheConfig.parcelCache, organisationId, { parcels })
  return parcels
}

const getLandCover = async (organisationId, callerId) => {
  const parcels = await getParcels(organisationId, callerId)
  parcels.forEach(x => x.info.forEach(y => { y.area = convertMetresToHectares(y.area) }))
  return parcels
}

const getLandCoverArea = async (organisationId, callerId) => {
  const parcels = await getParcels(organisationId, callerId)
  return parcels.reduce((allTotal, parcel) => {
    const sum = parcel.info.reduce((total, parcelInfo) => {
      const area = parcelInfo.code !== bpsIneligibleFeatureCode ? parcelInfo.area : 0
      return total + convertMetresToHectares(area)
    }, 0)
    return allTotal + sum
  }, 0)
}

module.exports = {
  getLandCover,
  getLandCoverArea
}
