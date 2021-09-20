const { convertToInteger } = require('../conversion')

const calculateTotalArea = (parcels) => {
  const totalArea = parcels.reduce((a, b) => a + (b.area || 0), 0)
  return convertToInteger(totalArea)
}

module.exports = calculateTotalArea
