const { runArableSoilParcelRules, runArableSoilLandCoverRules } = require('./arable-soil')
const { runImprovedGrasslandParcelRules, runImprovedGrasslandLandCoverRules } = require('./improved-grassland')
const { runMoorlandParcelRules, runMoorlandLandCoverRules } = require('./moorland')

const runParcelRules = async (facts) => {
  switch (facts.standardCode) {
    case 'sfi-arable-soil':
      return runArableSoilParcelRules(facts)
    case 'sfi-improved-grassland':
      return runImprovedGrasslandParcelRules(facts)
    case 'sfi-moorland':
      return runMoorlandParcelRules(facts)
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
    case 'sfi-moorland':
      return runMoorlandLandCoverRules(facts)
    default:
      break
  }
}

module.exports = {
  runParcelRules,
  runLandCoverRules
}
