const sfiData = require('./data/sfi-pilot.json')

function checkExistingSFIAgreements (parcelId) {
  const item = sfiData.find(item => item.parcelId === parcelId)
  return item ? item.sfi : false
}

async function applyExistingSFIAgreements (standard) {
  const parcels = standard.parcels

  // Apply SSSI status to each parcel
  for (let i = 0; i < parcels.length; i++) {
    const parcel = parcels[i]
    const sfiStatus = checkExistingSFIAgreements(parcel.id)

    if (sfiStatus) {
      parcel.warnings.push({
        SFI: true
      })
    }
  }
}

module.exports = {
  checkSFI: checkExistingSFIAgreements,
  applyExistingSFIAgreements
}
