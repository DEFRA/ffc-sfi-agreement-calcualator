const rates = require('./rates.json')

/**
 * Calulates the standard payment rate for each ambition
 * @param {String} code - The land use cover code (standard code)
 * @param {Array} parcels - The array of eligible parcels allocated for use
 * @returns {Object} - A payment rates object
 */
function calculatePaymentRates (code, parcels) {
  const paymentRates = {}
  const rate = rates[`_${code}`] || {}
  const totalArea = parcels.reduce((a, b) => a + (b.area || 0), 0)

  for (const key in rate) {
    const ambitionRate = rate[key] || 0

    paymentRates[key] = {
      rate: ambitionRate,
      paymentAmount: (totalArea * ambitionRate).toFixed(2)
    }
  }

  return paymentRates
}

module.exports = {
  calculatePaymentRates
}
