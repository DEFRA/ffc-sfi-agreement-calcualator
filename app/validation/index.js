const checks = require('./checks')

const validateAgreement = (agreement, correlationId) => {
  const checkResults = checks.map(x => x.run(agreement))

  return {
    correlationId,
    sbi: agreement.sbi,
    agreementNumber: agreement.agreementNumber,
    isValid: checkResults.some(x => !x.isValid),
    errors: [].concat(checkResults.map(x => x.errors)),
    warnings: [].concat(checkResults.map(x => x.warnings))
  }
}

module.exports = validateAgreement
