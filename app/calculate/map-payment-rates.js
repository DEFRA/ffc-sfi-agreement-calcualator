const mapPaymentRatesForStandard = (standard, calculateDate) => {
  return standard?.levels?.map(x => ({ name: x.name, rate: getValidRateForLevel(x.rates, calculateDate) })) ?? []
}

const getValidRateForLevel = (rates, calculateDate) => {
  const validRates = getValidRates(rates, calculateDate)
  const latestValidRate = getLatestValidRate(validRates)
  return latestValidRate?.rate ?? 0
}

const getValidRates = (rates, calculateDate) => {
  return rates.filter(x => x.startDate <= calculateDate)
}

const getLatestValidRate = (validRates) => {
  return validRates.reduce((x, y) => x.startDate > y.startDate ? x : y, 0)
}

module.exports = mapPaymentRatesForStandard
