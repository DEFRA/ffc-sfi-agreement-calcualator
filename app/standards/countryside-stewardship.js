const csData = require('./data/cs.json')

function getCountrysideStewardshipClaim (parcelId, standardCode) {
  return csData[parcelId] && (csData[parcelId][`${standardCode}`] || 0)
}

module.exports = {
  getCountrysideStewardshipClaim
}
