const convertToInteger = (value) => {
  const currencyArray = value.toString().split('.')
  const integer = currencyArray[0]
  const decimal = (currencyArray[1] || '00').padEnd(2, '0')
  const trimmedDecimal = Math.ceil(decimal / (10 * decimal.length)) * (10 * decimal.length)
  return Number(integer + trimmedDecimal)
}

const convertToDecimal = (value) => {
  return (value / 100).toFixed(2)
}

module.exports = {
  convertToInteger,
  convertToDecimal
}
