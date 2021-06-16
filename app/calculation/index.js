const { getParcelCovers } = require('../api/map')
const rates = require('./rates')

const calculatePrimary = (agreement, totalArea) => {
  return agreement.primaryActions
    ? totalArea * rates.primaryActions.find(action =>
      action.action === agreement.primaryActions.length.toString()).value
    : 0
}

const calculateSecondary = (agreement, totalArea) => {
  return agreement.paymentActions ? rates.paymentActions.reduce((x, y) => {
    return agreement.paymentActions.find(action => action === y.action) ? x + y.value : 0
  }, 0) * totalArea : 0
}

const calculateParcels = (sbi, parcels) => {
  const promises = []

  parcels.forEach(parcel => {
    promises.push(getParcelCovers(sbi, parcel.sheetId, parcel.parcelId))
  })

  return Promise.all(promises).then(results => {
    return results.reduce((x, y) => x + y.totalArea, 0)
  })
}

const calculateAgreement = async (agreement) => {
  const totalArea = calculateParcels(agreement.sbi, agreement.parcels)
  // const { totalArea } = await getParcelCovers(agreement.sbi, null, null, null)
  const primaryCalculation = calculatePrimary(agreement, totalArea)
  const secondaryCalculation = calculateSecondary(agreement, totalArea)
  return {
    totalArea: totalArea.toFixed(2),
    totalPrimary: calculatePrimary(agreement, totalArea).toFixed(2),
    totalSecondary: calculateSecondary(agreement, totalArea).toFixed(2),
    totalPayment: (primaryCalculation + secondaryCalculation).toFixed(2)
  }
}

module.exports = calculateAgreement
