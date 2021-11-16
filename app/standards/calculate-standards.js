const { convertToDecimal } = require('../conversion')
const { runLandCoverRules, runParcelRules } = require('../rules-engine/sets/parcel')
const standards = require('./funding-options')

const calculateStandards = async (sbi, parcels) => {
  for (const parcel of parcels) {
    for (const standard of standards) {
      standard.parcels = []
      const parcelResult = await runParcelRules({ code: standard.code, sbi, ...parcel })
      if (!parcelResult.failureEvents.length) {
        for (const landCover of parcel.info) {
          const landCoverResult = await runLandCoverRules({ code: standard.code, sbi, ...parcel })
          if (!landCoverResult.failureEvents.length) {
            standard.parcels.push({
              id: parcel.id,
              area: convertToDecimal(landCover.area)
            })
          }
        }
      }
    }
  }

  return standards
}

module.exports = calculateStandards
