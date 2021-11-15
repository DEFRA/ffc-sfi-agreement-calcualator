const { getOrganisations } = require('../legacy/organisations')
const runEligibilityRules = require('../rule-sets/eligibility')

async function getEligibleOrganisations (facts) {
  const eligibleOrganisations = []
  const organisations = getOrganisations(facts.crn, ['Amend'])
  for (const organisation of organisations) {
    const result = await runEligibilityRules(organisation)
    if (!result.failureEvents.length) {
      eligibleOrganisations.push(organisation)
    }
  }
  return eligibleOrganisations
}

module.exports = {
  getEligibleOrganisations
}
