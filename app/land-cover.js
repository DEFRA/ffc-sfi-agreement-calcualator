const { get } = require('./api')
const { convertToInteger } = require('./conversion')

const getLandCover = async (organisationId, callerId) => {
  const parcels = await get(`/lms/organisation/${organisationId}/land-covers`, callerId)
  parcels.forEach(x => x.info.forEach(y => { y.area = convertMetresToHectares(y.area) }))
  return parcels
}

const getLandCoverArea = async (organisationId, callerId) => {
  let area = 0
  const landCover = await getLandCover(organisationId, callerId)
  for (const parcel of landCover) {
    const infos = parcel.info
    for (const info of infos) {
      if (info.area > 0) {
        area += info.area
      }
    }
  }

  return area
}

const convertMetresToHectares = (area) => {
  const metres = convertToInteger(area)
  return Math.ceil(metres / 10000)
}

module.exports = {
  getLandCover,
  getLandCoverArea
}
