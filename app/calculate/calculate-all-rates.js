const { convertToDecimal } = require('../conversion')

const calculateAllRates = (paymentRates, totalArea) => {
  const calculationResult = {}
  for (const paymentRate of paymentRates) {
    const paymentAmountInPence = Math.ceil((totalArea * paymentRate.rate) / 100)

    calculationResult[paymentRate.name] = {
      rate: convertToDecimal(paymentRate.rate),
      paymentAmount: convertToDecimal(paymentAmountInPence)
    }
  }
  return calculationResult
}

module.exports = calculateAllRates
