const { get } = require('../api')

async function getLandCover (organisationId, callerId) {
  const parcels = await get(`/lms/organisation/${organisationId}/land-covers`, callerId)
  parcels.forEach(p => p.info.forEach(i => (i.area /= 10000.0)))
  return parcels
}

module.exports = {
  getLandCover
}
