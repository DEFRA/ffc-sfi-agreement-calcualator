const TEST_DATA = require('./test-data.json')

function getBpsEntitlements (sbi) {
  return TEST_DATA.find(x => x.sbi === sbi)?.bpsEntitlements ?? 0
}

function getBpsEligibleLandInHectares (sbi) {
  return TEST_DATA.find(x => x.sbi === sbi)?.bpsEligibleHectares ?? 0
}

module.exports = {
  getBpsEntitlements,
  getBpsEligibleLandInHectares
}
