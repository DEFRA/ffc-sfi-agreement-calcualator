const validationResponse = (agreement, correlationId) => {
  return {
    correlationId: correlationId,
    isValid: true,
    agreementNumber: agreement.agreementNumber,
    sbi: agreement.sbi,
    errors: []
  }
}

module.exports = validationResponse
