const db = require('../data')

async function createAgreement (message) {
  const { body } = message
  const { sbi, agreement } = body

  return db.agreement.create({
    sbi,
    agreementData: agreement
  })
}

module.exports = {
  createAgreement
}
