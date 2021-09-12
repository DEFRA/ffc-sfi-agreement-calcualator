const { convertToDecimal, convertToInteger } = require('../conversion')
const getPaymentRates = require('./get-payment-rates')

const calculatePaymentRates = async (code, parcels, calculateDate = new Date()) => {
  const calculationResult = {}
  const paymentRates = await getPaymentRates(code.toString(), calculateDate)

  const totalArea = parcels.reduce((a, b) => a + (b.area || 0), 0)
  const totalAreaToCalculate = convertToInteger(totalArea)

  for (const paymentRate of paymentRates) {
    const paymentAmountInPence = Math.ceil((totalAreaToCalculate * paymentRate.rate) / 100)

    calculationResult[paymentRate.name] = {
      rate: convertToDecimal(paymentRate.rate),
      paymentAmount: convertToDecimal(paymentAmountInPence)
    }
  }
  return calculationResult
}

module.exports = {
  calculatePaymentRates
}
