const buildResponse = (calculatePayload) => {
  calculate(calculatePayload, 'soilProtection', 6)
  calculate(calculatePayload, 'permanentGrasslandProtection', 6)
  calculate(calculatePayload, 'moorlandGrazing', 6)
  calculate(calculatePayload, 'livestockWelfare', 6)
  return calculatePayload
}

const calculate = (calculatePayload, standardType, amount) => {
  const standard = calculatePayload.calculation.standards[standardType].actions
  for (const [key, value] of Object.entries(standard)) {
    standard[key] = value.map(action => {
      action.expression = 'x*y'
      action.value = 616800
      action.expression = `AREA*${amount}`
      action.value = action.area * amount
      return action
    })
  }
}

module.exports = buildResponse
