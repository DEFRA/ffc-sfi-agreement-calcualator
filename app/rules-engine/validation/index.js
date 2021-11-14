const getSFIEligibleOrganisations = require('./run-sfi-validation')

async function runValidation (facts) {
  if (facts.scheme === 'sfi') {
    return getSFIEligibleOrganisations(facts)
  }
  throw new Error(`Unknown scheme: ${facts.scheme}`)
}

module.exports = {
  runValidation
}
