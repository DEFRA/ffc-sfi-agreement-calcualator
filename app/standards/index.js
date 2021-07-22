const { checkSFI } = require('./sfi')
const { checkSSSI } = require('./sssi')
const { checkHEFER } = require('./hefer')
const { getLandCover } = require('./land-cover')
const { getCountrysideStewardshipClaim } = require('./countryside-stewardship')
const { getEnvironmentalStewardshipClaim } = require('./environmental-stewardship')

async function getStandards (organisationId, sbi, callerId) {
  // Get the land cover data for the organisation id
  const landCover = await getLandCover(organisationId, callerId)

  // Return the calculated standards for the land cover parcels
  return calculateStandards(landCover)
}

function calculateStandards (parcels) {
  const standards = [
    {
      code: '130',
      name: 'Permanent grassland',
      parcels: []
    },
    {
      code: '110',
      name: 'Arable land',
      parcels: []
    }
  ]

  for (const parcel of parcels) {
    const infos = parcel.info

    for (const standard of standards) {
      let area = 0

      // Sum the parcel area eligible for this standard
      for (const info of infos) {
        if (info.area > 0 && info.code === standard.code) {
          area += info.area
        }
      }

      // If there is area within the parcel, apply the -ve adjustments (CS/ES)
      // and then, if there is still parcel area remaining, apply the various
      // status flags (HEFER/SSSI/SFI) and add the parcel to the current standard.
      if (area > 0) {
        // Apply adjustments
        const csClaimArea = getCountrysideStewardshipClaim(parcel.id, standard.code)
        if (csClaimArea > 0) area -= csClaimArea

        const esClaimArea = getEnvironmentalStewardshipClaim(parcel.id, standard.code)
        if (esClaimArea > 0) area -= esClaimArea

        if (area > 0) {
          const warnings = []

          // Apply status flags
          const sssiStatus = checkSSSI(parcel.id)
          if (sssiStatus) warnings.push({ SSSI: true })

          const heferStatus = checkHEFER(parcel.id)
          if (heferStatus) warnings.push({ HEFER: true })

          const sfiStatus = checkSFI(parcel.id)
          if (sfiStatus) warnings.push({ SFI: true })

          // Add the parcel with the adjusted area to the standard
          standard.parcels.push({
            id: parcel.id,
            area,
            warnings
          })
        }
      }
    }
  }

  return standards
}

module.exports = {
  getStandards,
  calculateStandards
}
