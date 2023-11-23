const { get } = require('../api')

const getOrganisation = async (organisationId, crn, token) => {
  const url = `/organisation/${organisationId}`
  const data = await get(url, crn, token)
  return data?._data === null ? {} : data?._data
}

const getOrganisations = async (crn, token) => {
  const url = '/organisation/person/3337243/summary?search='
  const data = await get(url, crn, token)
  return data?._data?.map(organisation => ({
    sbi: organisation.sbi,
    name: organisation.name,
    organisationId: organisation.id
  })) ?? []
}

const enrichOrganisations = async (organisations, crn, token) => {
  for (const organisation of organisations) {
    const organisationDetails = await getOrganisation(organisation.organisationId, crn, token)
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
