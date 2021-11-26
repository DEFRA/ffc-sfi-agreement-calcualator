const { convertToInteger } = require('./conversion')
const runAgreementLandCoverRules = require('./rules-engine/sets/agreement')
const runEligibilityRules = require('./rules-engine/sets/eligibility')
const getStandards = require('./standards')

// const body = {
//   sbi
//   agreementNumber
//   organisationId
//   callerId
//   agreement: {
//     paymentAmount
//     standards: [{
//       code
//       paymentAmount
//       landCovers: [{
//         parcelId
//         code
//         area

const runValidation = async (facts) => {
  const warnings = []

  const eligibilityResult = await runEligibilityRules({ identifier: facts.sbi, ...facts })
  eligibilityResult.failureEvents.forEach((failure) => warnings.push({ type: 'Eligibility', detail: failure }))

  const standards = await getStandards(facts.organisationId, facts.sbi, facts.callerId)

  for (const agreementStandard of facts.agreement.standards) {
    const standard = standards.find(x => x.code === agreementStandard.code)
    for (const agreementLandCover of agreementStandard.landCovers) {
      agreementLandCover.area = convertToInteger(agreementLandCover.area)
      const standardLandCover = standard.landCovers.find(x => x.code === agreementLandCover.code)
      const result = await runAgreementLandCoverRules({ identifier: agreementLandCover.code, agreementLandCover, standardLandCover })
      result.failureEvents.forEach((failure) => warnings.push({ type: 'Validation', detail: failure }))
    }
  }

  return warnings
}

module.exports = runValidation
