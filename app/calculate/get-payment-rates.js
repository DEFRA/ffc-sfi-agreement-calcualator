const db = require('../data')
const getValidPaymentRatesForStandard = require('./get-valid-payment-rates')

const getPaymentRates = async (code, calculateDate) => {
  const standard = await db.standard.findOne({
    where: { code },
    nest: true,
    include: {
      model: db.level,
      as: 'levels',
      include: {
        model: db.rate,
        as: 'rates'//,
        // where: {
        //   startDate: { [db.Sequelize.Op.lte]: calculateDate }
        // },
        // order: ['startDate', 'DESC'],
        // limit: 1
      }
    }
  })
  return getValidPaymentRatesForStandard(standard, calculateDate)
}

module.exports = getPaymentRates
