const { get } = require('../api/private')

async function getOrganisations (crn, callerId) {
  const url = `/organisation/person/${callerId}/summary?search=`
  const data = await get(url, callerId)
  return data?._data?.map(organisation => ({
    sbi: organisation.sbi,
    name: organisation.name,
    organisationId: organisation.id
  }))
}

module.exports = {
  getOrganisations
}
