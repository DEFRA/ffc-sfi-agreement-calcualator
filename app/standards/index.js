const { applySSSI } = require('./sssi')
const { applyHEFER } = require('./hefer')
const { getLandCover } = require('./land-cover')
const { filterExistingSFIAgreements } = require('./sfi')
const { filterCountrysideStewardshipClaim } = require('./countryside-stewardship')
const { filterEnvironmentalStewardshipClaim } = require('./environmental-stewardship')

// const standards = [{
//   id: 1,
//   name: 'soilProtection'
// },
// {
//   id: 2,
//   name: 'permanentGrasslandProtection'
// },
// {
//   id: 3,
//   name: 'moorlandGrazing'
// },
// {
//   id: 4,
//   name: 'livestockWelfare'
// }]

async function getStandards (sbi) {
  // Get the land cover data for the sbi
  const landCover = await getLandCover(sbi)

  // Apply SSSI status
  await applySSSI(landCover)

  // Apply CS filter to land cover
  await filterCountrysideStewardshipClaim(landCover)

  // Apply ES filter to land cover
  await filterEnvironmentalStewardshipClaim(landCover)

  // Apply SSSI status
  await applyHEFER(landCover)

  // Apply existing SFI agreement filter to land cover
  await filterExistingSFIAgreements(landCover)

  return landCover
}

module.exports = getStandards
