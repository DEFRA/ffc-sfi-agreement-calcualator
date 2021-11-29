const { getParcels } = require('./land')
const BPS_INELIGIBLE_FEATURE_CODE = '000'

async function getEntitlements (sbi) {
  return 5
}

async function getEligibleLand (organisationId, callerId, cap) {
  const parcels = await getParcels(organisationId, callerId)
  return getEligibleLandFromParcels(parcels)
}

function getEligibleLandFromParcels (parcels, cap) {
  let totalArea = 0
  for (const parcel of parcels) {
    for (const landCover of parcel.info) {
      if (landCover.code !== BPS_INELIGIBLE_FEATURE_CODE) {
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
  getEntitlements,
  getEligibleLand
}
