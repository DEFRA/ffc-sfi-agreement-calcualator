const { get } = require('./api')
const { convertToInteger } = require('./conversion')
const config = require('./config')

const getLandCover = async (organisationId, callerId) => {
  const parcels = await get(`/lms/organisation/${organisationId}/land-covers`, callerId)
  parcels.forEach(x => x.info.forEach(y => { y.area = convertMetresToHectares(y.area) }))
  return parcels
}

const getLandCoverArea = async (organisationId, callerId) => {
  let area = 0
  const landCover = await get(`/lms/organisation/${organisationId}/land-covers`, callerId)
  for (const parcel of landCover) {
    if (area > config.eligibleHa) break
    const infos = parcel.info.filter(x => x.area > 0)
    for (const info of infos) {
      if (area > config.eligibleHa) break
      area += convertMetresToHectares(info.area)
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
