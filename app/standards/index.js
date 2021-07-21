const { applySSSI } = require('./sssi')
const { applyHEFER } = require('./hefer')
const { getLandCover } = require('./land-cover')
const { applyExistingSFIAgreements } = require('./sfi')
const { filterCountrysideStewardshipClaim } = require('./countryside-stewardship')
const { filterEnvironmentalStewardshipClaim } = require('./environmental-stewardship')

async function getStandards (organisationId, sbi, callerId) {
  // Get the land cover data for the organisation id
  const landCover = await getLandCover(organisationId, callerId)

  const getParcelsByCode = (code) => {
    return landCover.filter(parcel => parcel.info.find(info => info.code === code && info.area > 0))
  }

  const standards = [
    {
      code: '130',
      name: 'Permanent grassland'
    },
    {
      code: '110',
      name: 'Arable land'
    }
  ]

  for (let i = 0; i < standards.length; i++) {
    const standard = standards[i]

    const parcels = getParcelsByCode(standard.code)

    standard.parcels = parcels.map(parcel => ({
      id: parcel.id,
      area: parcel.info
        .filter(info => info.code === standard.code)
        .map(info => info.area)
        .reduce((a, b) => a + b, 0),
      warnings: []
    }))

    // Apply SSSI status
    await applySSSI(standard)

    // Apply CS filter to land cover
    await filterCountrysideStewardshipClaim(standard)

    // Apply ES filter to land cover
    await filterEnvironmentalStewardshipClaim(standard)

    // Apply HEFER status
    await applyHEFER(standard)

    // Apply existing SFI agreement filter to land cover
    await applyExistingSFIAgreements(standard)
  }

  return standards
}

module.exports = { getStandards }
