const db = require('../data')

const getAllStandards = async () => {
  const standards = await db.standard.findAll({
    include: db.landCovers,
    as: 'landCovers',
    nest: true
  })

  return mapStandards(standards)
}

const mapStandards = (standards) => standards.map(x => ({
  code: x.code,
  landCoverCodes: x.landCovers?.map(y => y.code) ?? [],
  name: x.name,
  parcels: []
}))

module.exports = getAllStandards
