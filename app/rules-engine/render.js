function render (message, ruleResult) {
  // if rule succeeded, render success message
  if (ruleResult.result) {
    return console.log(`${message}`)
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
  console.log(`${message} ${detail}`)
}

module.exports = render
