const esData = require('./data/es.json')

function getEnvironmentalStewardshipClaim (parcelId, landCoverCode) {
  return esData[parcelId] && (esData[parcelId][`_${landCoverCode}`] || 0)
}

module.exports = {
  getEnvironmentalStewardshipClaim
}
