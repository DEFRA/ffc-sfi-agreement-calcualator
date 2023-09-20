const { getOrganisations, enrichOrganisations } = require('./legacy/organisation')
const runEligibilityRules = require('./rules-engine/sets/eligibility')

const getEligibleOrganisations = async (crn, token) => {
  const eligibleOrganisations = []
  const organisations = await getOrganisations(crn, token)
  for (const organisation of organisations) {
    const result = await runEligibilityRules({ identifier: organisation.sbi, ...organisation, crn, token })
    if (!result.failureEvents.length) {
      eligibleOrganisations.push(organisation)
    }
  }
  const enrichedOrganisations = await enrichOrganisations(eligibleOrganisations, crn, token)
  return sortOrganisations(enrichedOrganisations)
}

const sortOrganisations = (organisations) => {
  return organisations.sort((a, b) => (a.name > b.name) ? 1 : -1)
}

module.exports = {
  getEligibleOrganisations
}
