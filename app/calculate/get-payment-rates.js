const db = require('../data')
const mapPaymentRatesForStandard = require('./map-payment-rates')

const getPaymentRates = async (code, calculateDate) => {
  const standard = await db.standard.findOne({
    where: { code },
    nest: true,
    include: {
      model: db.level,
      as: 'levels',
      include: {
        model: db.rate,
        as: 'rates'
      }
    }
  })
  return mapPaymentRatesForStandard(standard, calculateDate)
}

module.exports = getPaymentRates
