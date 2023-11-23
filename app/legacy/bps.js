const { getParcels } = require('./land')
const bpsEligibleLandCover = require('./bps-eligible-land-cover')

async function getEligibleLand (organisationId, crn, token, cap) {
  const parcels = await getParcels(organisationId, crn, token)
  return getEligibleLandFromParcels(parcels)
}

function getEligibleLandFromParcels (parcels, cap) {
  let totalArea = 0
  for (const parcel of parcels) {
    for (const landCover of parcel.info) {
      if (bpsEligibleLandCover.some(x => x.code === landCover.code)) {
        totalArea += landCover.area
      }
    }
    if (cap && totalArea >= cap) {
      return cap
    }
  }
  return totalArea
}

module.exports = {
  getEligibleLand
}
