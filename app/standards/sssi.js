async function checkSSSI (parcelId) {
  return Promise.resolve({ parcelId, result: false })
}

async function applySSSI (landCover) {
  const parcels = landCover.parcels // TODO

  // Apply SSSI status to each parcel
  for (let i = 0; i < parcels.length; i++) {
    const parcel = parcels[i]

    const sssiStatus = await checkSSSI(parcel.id)
    parcel.hasSSSI = sssiStatus.result
  }
}

module.exports = {
  applySSSI,
  checkSSSI
}
