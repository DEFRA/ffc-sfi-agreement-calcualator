const { get } = require('../api')

async function getLandCover (organisationId, callerId) {
  const parcels = await get(`/lms/organisation/${organisationId}/land-covers`, callerId)
  return parcels
}

module.exports = {
  getLandCover
}
