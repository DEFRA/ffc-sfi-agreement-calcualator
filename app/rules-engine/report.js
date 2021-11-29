const { sendEvent } = require('../events')

const report = async (event, almanac, ruleResult) => {
  const identifier = await almanac.factValue('identifier')
  const sbi = await almanac.factValue('sbi')
  const result = ruleResult.result ? 'passed' : 'failed'
  const message = `SBI ${sbi} ${result} rule: ${event.params.message} (${identifier})`
  await sendEvent({ sbi, identifier, passed: true, message }, 'uk.gov.sfi.agreement.calculator.rule')
  console.log(message)
}

module.exports = report
