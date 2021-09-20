const convertToInteger = (value) => {
  const currencyArray = value.toString().split('.')
  const pounds = currencyArray[0]
  const pence = (currencyArray[1] || '00').padEnd(2, '0')
  return Number(pounds + pence)
}

const convertToDecimal = (value) => {
  return (value / 100).toFixed(2)
}

module.exports = {
  convertToInteger,
  convertToDecimal
}
