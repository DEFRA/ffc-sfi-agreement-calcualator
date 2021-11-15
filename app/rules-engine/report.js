
async function report (event, almanac, ruleResult) {
  const sbi = await almanac.factValue('sbi')
  // if rule succeeded, render success message
  if (ruleResult.result) {
    const message = `SBI ${sbi} passed SFI rule: ${event.params.message}`
    console.log(`${message}`)
  }
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
  console.log(`SBI ${sbi} failed SFI rule: ${ruleResult.name} - ${detail}`)
}

module.exports = report
