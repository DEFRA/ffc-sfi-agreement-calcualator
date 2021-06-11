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

const calculateAgreement = async (agreement) => {
  const { totalArea } = await getParcelCovers(agreement.sbi, null, null, null)
  const primaryCalculation = calculatePrimary(agreement, totalArea)
  const secondaryCalculation = calculateSecondary(agreement, totalArea)
  return {
    totalArea: totalArea,
    totalPrimary: calculatePrimary(agreement, totalArea),
    totalSecondary: calculateSecondary(agreement, totalArea),
    totalPayment: (primaryCalculation + secondaryCalculation)
  }
}

module.exports = calculateAgreement
