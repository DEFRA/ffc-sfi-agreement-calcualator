const db = require('./data')

const saveAgreement = async (agreementMessage) => {
  const { sbi, agreementNumber, agreement } = agreementMessage

  const transaction = await db.sequelize.transaction()
  try {
    const existingAgreement = await db.agreement.findOne({ where: { agreementNumber } })
    if (existingAgreement) {
      console.info(`Duplicate agreement received, skipping ${agreementNumber}`)
      await transaction.rollback()
    } else {
      await db.agreement.create({ sbi, agreementNumber, agreementData: agreement }, { transaction })
      await transaction.commit()
    }
  } catch (error) {
    await transaction.rollback()
    throw (error)
  }
}

module.exports = saveAgreement
