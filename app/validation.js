const runValidationRules = require('./rules-engine/sets/validation')

const runValidation = async (facts) => {
  const warnings = []
  const result = await runValidationRules(facts)
  result.failureEvents.forEach((failure) => warnings.push(failure))
  return warnings
}

module.exports = runValidation
