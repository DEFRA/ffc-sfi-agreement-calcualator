const { getOrganisations, enrichOrganisations } = require('./organisation')
const { getLandCoverArea } = require('./land-cover')
const eligibleHa = 500

const sortOrganisations = (organisations) => {
  return organisations.sort((a, b) => (a.name > b.name) ? 1 : -1)
}

const getEligibleLand = async (organisations, callerId) => {
  const landEligible = []
  for (const organisation of organisations) {
    const totalArea = await getLandCoverArea(organisation.organisationId, callerId)
    totalArea > eligibleHa && landEligible.push(organisation.organisationId)
  }
  return organisations.filter(({ organisationId }) => landEligible.includes(organisationId))
}

const getEligibleOrganisations = async (crn, callerId) => {
  let organisations = await getOrganisations(crn, callerId)

  if (organisations) {
    organisations = await getEligibleLand(organisations, callerId)
    organisations = await enrichOrganisations(organisations, callerId)
    console.info(`Eligible organisations: CRN - ${crn}, CallerId - ${callerId}, SBIs - ${organisations.map(a => a.sbi)}`)
    return sortOrganisations(organisations)
  }

  return []
}

module.exports = getEligibleOrganisations
