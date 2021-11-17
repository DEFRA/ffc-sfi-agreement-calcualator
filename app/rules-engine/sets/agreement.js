const getRulesEngine = require('../engine')
const { hasSufficientLandCover } = require('../rules/agreement')

const runAgreementLandCoverRules = async (facts) => {
  const engine = getRulesEngine()
  engine.addRule(hasSufficientLandCover)
  return engine.run(facts)
}

module.exports = runAgreementLandCoverRules
