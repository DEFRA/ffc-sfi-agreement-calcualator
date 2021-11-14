const TEST_DATA = require('./test-data.json')

function getOrganisations (crn, roles) {
  return TEST_DATA.filter(x => x.crns.includes(crn) && x.roles.some(y => roles.includes(y)))
}

module.exports = {
  getOrganisations
}
