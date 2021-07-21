// const { get } = require('../api')
const landCover = require('./data/land-cover.json')

async function getLandCover (organisationId, callerId) {
  return landCover
  // const parcels = await get(`/lms/organisation/${organisationId}/land-covers`, callerId)
  // return parcels
}

module.exports = {
  getLandCover
}
