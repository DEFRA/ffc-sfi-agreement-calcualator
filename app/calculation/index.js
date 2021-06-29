const buildResponse = (calculationPayload) => {
  calculate(calculationPayload, 'soilProtection', 6)
  calculate(calculationPayload, 'permanentGrasslandProtection', 6)
  calculate(calculationPayload, 'moorlandGrazing', 6)
  calculate(calculationPayload, 'livestockWelfare', 6)
  return calculationPayload
}

const calculate = (calculationPayload, standardType, amount) => {
  const standard = calculationPayload.calculation.standards[standardType].actions
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
