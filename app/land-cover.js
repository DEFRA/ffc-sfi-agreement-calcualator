const { get } = require('./api')
const { convertMetresToHectares } = require('./conversion')
const bpsIneligibleFeatureCode = '000'

const getLandCover = async (organisationId, callerId) => {
  const parcels = await get(`/lms/organisation/${organisationId}/land-covers`, callerId)
  parcels.forEach(x => x.info.forEach(y => { y.area = convertMetresToHectares(y.area) }))
  return parcels
}

const getLandCoverArea = async (organisationId, callerId) => {
  const landCover = await get(`/lms/organisation/${organisationId}/land-covers`, callerId)
  return landCover.reduce((allTotal, parcel) => {
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
