const { convertToInteger } = require('../conversion')

const calculateTotalArea = (parcels) => {
  return parcels.reduce((a, b) => a + (convertToInteger(b.area || 0)), 0)
}

module.exports = calculateTotalArea
