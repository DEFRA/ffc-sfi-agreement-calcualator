const { get } = require('../api/private')

const getOrganisation = async (organisationId, callerId) => {
  const url = `/organisation/${organisationId}`
  const data = await get(url, callerId)
  return data?._data === null ? {} : data?._data
}

const getOrganisations = async (crn, callerId) => {
  const url = `/organisation/person/${callerId}/summary?search=`
  const data = await get(url, callerId)
  return data?._data?.map(organisation => ({
    sbi: organisation.sbi,
    name: organisation.name,
    organisationId: organisation.id
  }))
}

const enrichOrganisations = async (organisations, callerId) => {
  for (const organisation of organisations) {
    const organisationDetails = await getOrganisation(organisation.organisationId, callerId)
    const address = mapAddress(organisationDetails?.address)
    organisation.address = address
  }

  return organisations
}

const mapAddress = (address) => {
  return address
    ? [
        address.address1 ?? null,
        address.address2 ?? null,
        address.address3 ?? null,
        address.postalCode ?? null].filter(Boolean).join(', ')
    : ''
}

module.exports = {
  enrichOrganisations,
  getOrganisation,
  getOrganisations
}
