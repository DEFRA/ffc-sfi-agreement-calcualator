const csData = require('./data/cs.json')

function getCountrysideStewardshipClaim (parcelId, landCoverCode) {
  return csData[parcelId] && (csData[parcelId][`_${landCoverCode}`] || 0)
}

module.exports = {
  getCountrysideStewardshipClaim
}
