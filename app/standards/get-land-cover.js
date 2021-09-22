const { get } = require('../api')
const { convertToInteger } = require('../conversion')

const getLandCover = async (organisationId, callerId) => {
  const parcels = await get(`/lms/organisation/${organisationId}/land-covers`, callerId)
  parcels.forEach(x => x.info.forEach(y => { y.area = convertMetresToHectares(y.area) }))
  return parcels
}

const convertMetresToHectares = (area) => {
  const metres = convertToInteger(area)
  return Math.ceil(metres / 10000)
}

module.exports = getLandCover
