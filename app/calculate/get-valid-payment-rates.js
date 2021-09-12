const getValidPaymentRatesForStandard = (standard, calculateDate) => {
  return standard?.levels?.map(x => ({ name: x.name, rate: getRate(x.rates, calculateDate) })) ?? []
}

const getRate = (rates, calculateDate) => {
  const ratesInDate = rates.filter(x => x.startDate <= calculateDate)
  const validRate = ratesInDate.reduce((x, y) => x.startDate > y.startDate ? x : y)
  return validRate?.rate ?? 0
}

module.exports = getValidPaymentRatesForStandard
