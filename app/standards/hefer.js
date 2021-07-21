const heferData = require('./data/hefer.json')

function checkHEFER (parcelId) {
  return heferData.includes(parcelId)
}

module.exports = {
  checkHEFER
}
