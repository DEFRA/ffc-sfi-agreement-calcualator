const { runArableSoilParcelRules, runArableSoilLandCoverRules } = require('./arable-soil')
const { runImprovedGrasslandParcelRules, runImprovedGrasslandLandCoverRules } = require('./improved-grassland')

const runParcelRules = async (facts) => {
  switch (facts.standardCode) {
    case 'sfi-arable-soil':
      return runArableSoilParcelRules(facts)
    case 'sfi-improved-grassland':
      return runImprovedGrasslandParcelRules(facts)
    default:
      break
  }
}

const runLandCoverRules = async (facts) => {
  switch (facts.standardCode) {
    case 'sfi-arable-soil':
      return runArableSoilLandCoverRules(facts)
    case 'sfi-improved-grassland':
      return runImprovedGrasslandLandCoverRules(facts)
    default:
      break
  }
}

module.exports = {
  runParcelRules,
  runLandCoverRules
}
