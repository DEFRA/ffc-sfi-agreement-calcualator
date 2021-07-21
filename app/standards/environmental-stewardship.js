const esData = require('./data/es.json')

async function filterEnvironmentalStewardshipClaim (standard) {
  // Filter out any areas that are already used
  // in parcels for conflicting land covers
  const parcels = standard.parcels

  for (let i = 0; i < parcels.length; i++) {
    const parcel = parcels[i]
    const item = esData.find(item => item.parcelId === parcel.id)

    if (item) {
      const landCover = item.landCover.find(lc => lc.code === standard.code && lc.area > 0)

      if (landCover) {
        parcel.area -= landCover.area
      }
    }
  }
}

function getEnvironmentalStewardshipClaim (parcelId, landCoverCode) {
  return esData
    .filter(item => item.parcelId === parcelId)
    .map(item => item.landCover.filter(lc => lc.code === landCoverCode))
    .flat()
    .map(item => item.area)
    .reduce((a, b) => a + b, 0)
}

module.exports = {
  getEnvironmentalStewardshipClaim,
  filterEnvironmentalStewardshipClaim
}
