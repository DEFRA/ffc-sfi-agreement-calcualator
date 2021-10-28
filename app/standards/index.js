const calculateStandards = require('./calculate-standards')
const { getParcels } = require('../land')

const getStandards = async (organisationId, sbi, callerId) => {
  const parcels = await getParcels(organisationId, callerId)
  return calculateStandards(parcels)
}

module.exports = getStandards
