const { convertToInteger } = require('./conversion')
const runAgreementLandCoverRules = require('./rules-engine/sets/agreement')
const runEligibilityRules = require('./rules-engine/sets/eligibility')
const getStandards = require('./standards')

const runValidation = async (facts) => {
  const warnings = []

  const eligibilityResult = await runEligibilityRules({ identifier: facts.organisation.sbi, ...facts.organisation })
  eligibilityResult.failureEvents.forEach((failure) => warnings.push({ type: 'Eligibility', detail: failure }))

  const standards = await getStandards(facts.organisation.organisationId, facts.organisation.sbi, facts.callerId)

  for (const agreementStandard in facts.action) {
    if (agreementStandard !== 'paymentAmount') {
      const standard = standards.standards.find(x => x.code === facts.action[agreementStandard])
      for (const agreementLandCover of facts.action[agreementStandard].landCovers) {
        agreementLandCover.area = convertToInteger(agreementLandCover.area)
        const standardLandCover = standard.landCovers.find(x => x.code === agreementLandCover.code)
        const result = await runAgreementLandCoverRules({ sbi: facts.organisation.sbi, identifier: agreementLandCover.code, agreementLandCover, standardLandCover })
        result.failureEvents.forEach((failure) => warnings.push({ type: failure.type, detail: 'Failed' }))
      }
    }
  }

  return warnings
}

module.exports = runValidation
