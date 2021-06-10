const { getParcelCovers } = require('../api/map')

const calculateAgreement = async (agreement) => {
  const { totalArea } = await getParcelCovers(agreement.sbi, null, null, 'Permanent grassland')
  return totalArea * 0.25
}

module.exports = calculateAgreement
