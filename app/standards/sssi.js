const sssiData = require('./data/sssi.json')

function checkSSSI (parcelId) {
  return sssiData.includes(parcelId)
}

module.exports = {
  checkSSSI
}
