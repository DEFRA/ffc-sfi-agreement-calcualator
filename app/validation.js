const { convertToInteger } = require('./conversion')
const runAgreementLandCoverRules = require('./rules-engine/sets/agreement')
const runEligibilityRules = require('./rules-engine/sets/eligibility')
const getStandards = require('./standards')

const runValidation = async (facts) => {
  const warnings = []

  const eligibilityResult = await runEligibilityRules({ identifier: facts.organisation.sbi, ...facts.organisation, callerId: facts.callerId })
  eligibilityResult.failureEvents.forEach((failure) => warnings.push({ type: 'Eligibility', detail: failure }))

  const standards = await getStandards(facts.organisation.organisationId, facts.organisation.sbi, facts.callerId)

  for (const agreementStandard in facts.action) {
    if (agreementStandard !== 'paymentAmount') {
      const standard = standards.standards.find(x => x.code === agreementStandard)
      for (const agreementLandCover of facts.action[agreementStandard].landCovers) {
        const result = await runLandCoverValidation(agreementLandCover, standard, facts)
        result.failureEvents.forEach((failure) => warnings.push({ type: failure.type, detail: 'Failed' }))
      }
    }
  }

  return warnings
}

async function runLandCoverValidation (agreementLandCover, standard, facts) {
  agreementLandCover.area = convertToInteger(agreementLandCover.area)
  const standardLandCover = standard.landCovers.find(x => x.code === agreementLandCover.code)
  return runAgreementLandCoverRules({ sbi: facts.organisation.sbi, identifier: agreementLandCover.code, agreementLandCover, standardLandCover })
}

module.exports = runValidation
