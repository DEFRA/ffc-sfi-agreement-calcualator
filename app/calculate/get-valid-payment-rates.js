const getValidPaymentRatesForStandard = (standard, calculateDate) => {
  return standard?.levels?.map(x => ({ name: x.name, rate: x.rates[0]?.rate ?? 0 })) ?? []
}

module.exports = getValidPaymentRatesForStandard
