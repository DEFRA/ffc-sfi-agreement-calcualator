const getSFIEligibleOrganisations = require('./get-sfi-organisations')

async function getEligibleOrganisations (facts) {
  if (facts.scheme === 'sfi') {
    return getSFIEligibleOrganisations(facts)
  }
  throw new Error(`Unknown scheme: ${facts.scheme}`)
}

module.exports = {
  getEligibleOrganisations
}
