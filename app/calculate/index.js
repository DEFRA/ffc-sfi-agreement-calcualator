const calculateAllRates = require('./calculate-all-rates')
const calculateTotalArea = require('./calculate-total-area')
const getPaymentRates = require('./get-payment-rates')

const calculatePaymentRates = async (code, landCovers, calculateDate = new Date()) => {
  const paymentRates = await getPaymentRates(code, calculateDate)
  const totalArea = calculateTotalArea(landCovers)
  return calculateAllRates(paymentRates, totalArea)
}

module.exports = calculatePaymentRates
