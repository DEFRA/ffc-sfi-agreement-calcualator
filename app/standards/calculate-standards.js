const { convertToDecimal } = require('../conversion')
const { runLandCoverRules, runParcelRules } = require('../rules-engine/sets/standards')
const standards = require('./funding-options')

const calculateStandards = async (sbi, parcels) => {
  for (const standard of standards) {
    standard.landCovers = []
    for (const parcel of parcels) {
      const parcelResult = await runParcelRules({ sbi, identifier: parcel.id, standardCode: standard.code, ...parcel })
      if (!parcelResult.failureEvents.length) {
        const landCovers = getGroupedLandCovers(parcel.info)
        for (const landCover of landCovers) {
          const landCoverResult = await runLandCoverRules({ sbi, identifier: `${parcel.id} ${landCover.code}`, standardCode: standard.code, ...landCover })
          if (!landCoverResult.failureEvents.length) {
            standard.landCovers.push({
              parcelId: parcel.id,
              code: landCover.code,
              area: convertToDecimal(landCover.area)
            })
          }
        }
      }
    }
  }

  return standards
}

const getGroupedLandCovers = (infos) => {
  return [...infos.reduce((x, y) => {
    const key = y.code

    // if key doesn't exist then first instance so create new group
    const item = x.get(key) || Object.assign({}, { code: y.code, area: 0 })
    item.area += Number(y.area)

    return x.set(key, item)
  }, new Map()).values()].filter(x => x.area > 0)
}

module.exports = calculateStandards
