const calculateStandards = require('./calculate-standards')
const { getLandCover } = require('./land-cover')

const getStandards = async (organisationId, sbi, callerId) => {
  const landCover = await getLandCover(organisationId, callerId)
  return calculateStandards(landCover)
}

module.exports = getStandards
