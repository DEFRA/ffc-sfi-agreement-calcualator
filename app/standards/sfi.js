const sfiData = require('./data/sfi-pilot.json')

function checkSFI (parcelId) {
  return sfiData.includes(parcelId)
}

module.exports = {
  checkSFI
}
