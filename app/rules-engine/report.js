const { sendEvent } = require('../events')

const report = async (event, almanac, ruleResult) => {
  const identifier = await almanac.factValue('identifier')
  const result = ruleResult.result ? 'passed' : 'failed'
  const message = `${identifier} ${result} rule: ${event.params.message}`
  await sendEvent({ identifier, passed: true, message }, 'uk.gov.sfi.agreement.calculator.rule')
  console.log(message)
}

module.exports = report
