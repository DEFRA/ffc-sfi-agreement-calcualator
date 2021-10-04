const { get } = require('../api')

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
    organisationId: organisation.id,
    address: ''
  }))
}

const organisationAddress = (organisation) => {
  return organisation?.address
    ? [
        organisation.address.address1 ?? '',
        organisation.address.address2 ?? '',
        organisation.address.address3 ?? '',
        organisation.address.postalCode ?? ''].join(', ')
    : ''
}

const enrichOrganisations = async (organisations, callerId) => {
  for (const organisation of organisations) {
    const organisationDetails = await getOrganisation(organisation.organisationId, callerId)
    const address = organisationAddress(organisationDetails)
    organisation.address = address
  }

  return organisations
}

module.exports = {
  enrichOrganisations,
  getOrganisation,
  getOrganisations
}
