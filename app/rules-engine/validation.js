const runValidationRules = require('../rule-sets/validation')

async function runValidation (facts) {
  const warnings = []
  const result = await runValidationRules(facts)
  result.failureEvents.forEach((failure) => warnings.push(failure))
  return warnings
}

module.exports = runValidation
