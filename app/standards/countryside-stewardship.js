const csData = require('./data/cs.json')

async function filterCountrysideStewardshipClaim (standard) {
  // Filter out any areas that are already used
  // in parcels for conflicting land covers
  const parcels = standard.parcels

  for (let i = 0; i < parcels.length; i++) {
    const parcel = parcels[i]
    const item = csData.find(item => item.parcelId === parcel.id)

    if (item) {
      const landCover = item.landCovers.find(lc => lc.code === standard.code && lc.area > 0)

      if (landCover) {
        parcel.area -= landCover.area
      }
    }
  }
}

module.exports = {
  filterCountrysideStewardshipClaim
}
