const calculateStandards = require('./calculate-standards')
const { getParcels } = require('../land')

const getStandards = async (organisationId, sbi, callerId) => {
  const landCover = await getParcels(organisationId, callerId)
  return calculateStandards(landCover)
}

module.exports = getStandards
