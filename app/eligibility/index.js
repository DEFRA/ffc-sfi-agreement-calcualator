const { getOrganisations, enrichOrganisations } = require('./organisation')
const { getLandCoverArea } = require('../land-cover')
const config = require('../config')

const checkEligibility = async (crn, callerId) => {
  const organisations = await eligibleOrganisations(crn, callerId)
  console.info(`Eligible organisations: CRN - ${crn}, CallerId - ${callerId}, SBIs - ${organisations.map(a => a.sbi)}`)
  return organisations.sort((a, b) => (a.name > b.name) ? 1 : -1)
}

const eligibleLand = async (organisations, callerId) => {
  const landEligible = []

  for (const organisation of organisations) {
    const area = await getLandCoverArea(organisation.organisationId, callerId)
    area > config.eligibleHa && landEligible.push(organisation.organisationId)
  }
  return organisations.filter(({ organisationId }) => landEligible.includes(organisationId))
}

const eligibleOrganisations = async (crn, callerId) => {
  let organisations = await getOrganisations(crn, callerId)

  if (organisations) {
    organisations = await eligibleLand(organisations, callerId)
    return await enrichOrganisations(organisations, callerId)
  }

  return []
}

module.exports = checkEligibility
