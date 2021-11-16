const { getOrganisations, enrichOrganisations } = require('./legacy/organisations')
const runEligibilityRules = require('./rules-engine/sets/eligibility')

const getEligibleOrganisations = async (crn, callerId) => {
  const eligibleOrganisations = []
  const organisations = await getOrganisations(crn, callerId)
  for (const organisation of organisations) {
    const result = await runEligibilityRules(organisation)
    if (!result.failureEvents.length) {
      eligibleOrganisations.push(organisation)
    }
  }
  const enrichedOrganisations = await enrichOrganisations(eligibleOrganisations, callerId)
  return sortOrganisations(enrichedOrganisations)
}

const sortOrganisations = (organisations) => {
  return organisations.sort((a, b) => (a.name > b.name) ? 1 : -1)
}

module.exports = {
  getEligibleOrganisations
}
