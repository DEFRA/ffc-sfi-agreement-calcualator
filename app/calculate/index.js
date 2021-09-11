const { convertToDecimal } = require('../conversion')
const rates = require('./rates.json')

/**
 * Calculates the standard payment rate for each ambition
 * @param {String} code - The land use cover code (standard code)
 * @param {Array} parcels - The array of eligible parcels allocated for use
 * @returns {Object} - A payment rates object
 */
const calculatePaymentRates = (code, parcels) => {
  const paymentRates = {}
  const rate = rates[`_${code}`] || {}
  const totalArea = parcels.reduce((a, b) => a + (b.area || 0), 0)

  for (const key in rate) {
    const ambitionRate = rate[key] || 0

    const paymentAmountInPence = Math.ceil(totalArea * ambitionRate)

    paymentRates[key] = {
      rate: convertToDecimal(ambitionRate),
      paymentAmount: convertToDecimal(paymentAmountInPence)
    }
  }

  return paymentRates
}

module.exports = {
  calculatePaymentRates
}
