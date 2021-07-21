const sssiData = require('./data/hefer.json')

function checkHEFER (parcelId) {
  const item = sssiData.find(item => item.parcelId === parcelId)
  return item ? item.hefer : false
}

async function applyHEFER (standard) {
  const parcels = standard.parcels

  // Apply HEFER status to each parcel
  for (let i = 0; i < parcels.length; i++) {
    const parcel = parcels[i]
    const sssiStatus = checkHEFER(parcel.id)

    if (sssiStatus) {
      parcel.warnings.push({
        HEFER: true
      })
    }
  }
}

module.exports = {
  applyHEFER
}
