const { sendEvent } = require('../events')

const report = async (event, almanac, ruleResult) => {
  let message
  const sbi = await almanac.factValue('sbi')
  if (ruleResult.result) {
  // if rule succeeded, render success event
    message = `SBI ${sbi} passed rule: ${event.params.message}`
  } else {
  // if rule failed, iterate over each failed condition to determine why
    const detail = ruleResult.conditions.all.filter(condition => !condition.result)
      .map(condition => {
        switch (condition.operator) {
          case 'equal':
            return `was not an ${condition.fact}`
          case 'greaterThanInclusive':
            return `${condition.name} of ${condition.factResult} was too low`
          default:
            return ''
        }
      }).join(' and ')
    message = `SBI ${sbi} failed rule: ${ruleResult.name} - ${detail}`
  }
  await sendEvent({ sbi, passed: true, message }, 'uk.gov.sfi.agreement.calculator.rule')
  console.log(message)
}

module.exports = report
