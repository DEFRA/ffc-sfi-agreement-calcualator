async function filterEnvironmentalStewardshipClaim (landCover) {
  // Filter out any areas that are already used
  // in parcels for conflicting land covers
}

async function checkEnvironmentalStewardshipClaim (id) {
  return { id, result: false }
}

module.exports = {
  filterEnvironmentalStewardshipClaim,
  checkEnvironmentalStewardshipClaim
}
