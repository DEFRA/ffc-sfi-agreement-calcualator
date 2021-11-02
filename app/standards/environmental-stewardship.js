const esData = require('./data/es.json')

function getEnvironmentalStewardshipClaim (parcelId, standardCode) {
  return esData[parcelId] && (esData[parcelId][`${standardCode}`] || 0)
}

module.exports = {
  getEnvironmentalStewardshipClaim
}
