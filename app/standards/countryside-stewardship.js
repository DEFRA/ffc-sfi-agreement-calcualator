async function filterCountrysideStewardshipClaim (landCover) {
  // Filter out any areas that are already used
  // in parcels for conflicting land covers
}

async function checkCountrysideStewardshipClaim (id) {
  return { id, result: false }
}

module.exports = {
  filterCountrysideStewardshipClaim,
  checkCountrysideStewardshipClaim
}
