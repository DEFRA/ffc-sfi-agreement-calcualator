const calculateAllRates = require('./calculate-all-rates')
const calculateTotalArea = require('./calculate-total-area')
const getPaymentRates = require('./get-payment-rates')

const calculatePaymentRates = async (code, parcels, calculateDate = new Date()) => {
  const paymentRates = await getPaymentRates(code.toString(), calculateDate)
  const totalArea = calculateTotalArea(parcels)
  return calculateAllRates(paymentRates, totalArea)
}

module.exports = calculatePaymentRates
