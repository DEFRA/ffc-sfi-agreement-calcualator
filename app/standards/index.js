const { checkSFI } = require('./sfi')
const { checkSSSI } = require('./sssi')
const { checkHEFER } = require('./hefer')
const { getLandCover } = require('./land-cover')
const { getCountrysideStewardshipClaim } = require('./countryside-stewardship')
const { getEnvironmentalStewardshipClaim } = require('./environmental-stewardship')

async function getStandards (organisationId, sbi, callerId) {
  // Get the land cover data for the organisation id
  const landCover = await getLandCover(organisationId, callerId)

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

  for (let i = 0; i < landCover.length; i++) {
    const parcel = landCover[i]
    const parcelInfo = parcel.info

    for (let j = 0; j < standards.length; j++) {
      const standard = standards[j]
      let area = 0

      for (let k = 0; k < parcelInfo.length; k++) {
        const info = parcelInfo[k]

        if (info.area > 0 && info.code === standard.code) {
          area += info.area
        }
      }

      // Apply adjustments
      const csClaimArea = getCountrysideStewardshipClaim(parcel.id, standard.code)
      if (csClaimArea > 0) area -= csClaimArea

      const esClaimArea = getEnvironmentalStewardshipClaim(parcel.id, standard.code)
      if (esClaimArea > 0) area -= esClaimArea

      if (area > 0) {
        const warnings = []

        // Apply flags
        const sssiStatus = checkSSSI(parcel.id)
        if (sssiStatus) warnings.push({ SSSI: true })

        const heferStatus = checkHEFER(parcel.id)
        if (heferStatus) warnings.push({ HEFER: true })

        const sfiStatus = checkSFI(parcel.id)
        if (sfiStatus) warnings.push({ SFI: true })

        standard.parcels.push({
          id: parcel.id,
          area,
          warnings
        })
      }
    }
  }

  return standards
}

module.exports = { getStandards }
