const { getOrganisations, enrichOrganisations } = require('./organisation')
const { getLandCoverArea } = require('./land-cover')
const sendEvent = require('./events')
const eligibleHa = 500

const sortOrganisations = (organisations) => {
  return organisations.sort((a, b) => (a.name > b.name) ? 1 : -1)
}

const getEligibleLand = async (organisations, callerId) => {
  const landEligible = []
  for (const organisation of organisations) {
    const totalArea = await getLandCoverArea(organisation.organisationId, callerId)
    if (totalArea > eligibleHa) {
      landEligible.push(organisation.organisationId)
      await sendEvent({ sbi: organisation.sbi, eligible: true, validation: ['has 5 hectares of land eligible for BPS'] }, 'uk.gov.sfi.agreement.organisation.eligible')
    } else {
      await sendEvent({ sbi: organisation.sbi, eligible: false, validation: ['does not have 5 hectares of land eligible for BPS'] }, 'uk.gov.sfi.agreement.organisation.ineligible')
    }
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
