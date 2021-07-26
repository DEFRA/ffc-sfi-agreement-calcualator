const db = require('../data')

async function createAgreement (body) {
  const { sbi, agreement } = body

  return db.agreement.create({
    sbi,
    agreementData: agreement
  })
}

module.exports = {
  createAgreement
}
