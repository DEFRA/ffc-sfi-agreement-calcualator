const sssiData = require('./data/sssi.json')

function checkSSSI (parcelId) {
  const item = sssiData.find(item => item.parcelId === parcelId)
  return item ? item.sssi : false
}

async function applySSSI (standard) {
  const parcels = standard.parcels

  // Apply SSSI status to each parcel
  for (let i = 0; i < parcels.length; i++) {
    const parcel = parcels[i]
    const sssiStatus = checkSSSI(parcel.id)

    if (sssiStatus) {
      parcel.warnings.push({
        SSSI: true
      })
    }
  }
}

module.exports = {
  applySSSI,
  checkSSSI
}
