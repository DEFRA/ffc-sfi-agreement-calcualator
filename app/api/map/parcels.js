const base = require('./base')
const config = require('../../config')

const getParcels = async (sbi) => {
  const url = `${config.publicApi}LandParcels/MapServer/0/query?where=SBI=${sbi}&outFields=*&outSR=27700&f=geojson`
  const parcels = await base.get(url)

  return {
    parcels
  }
}

const getParcelCovers = async (sbi, sheetId, parcelId, description) => {
  const query = [`where=SBI=${sbi}`]
  sheetId && query.push(`sheet_id='${sheetId}'`)
  parcelId && query.push(`parcel_id='${parcelId}'`)
  description && query.push(`description=${description}`)

  const url = `${config.publicApi}LandCovers/MapServer/0/query?${query.join('+AND+')}&outFields=*&outSR=27700&f=geojson`
  const parcels = await base.get(url)

  return {
    totalArea: parcels.features.reduce((x, y) => x + y.properties.area_ha, 0)
  }
}

module.exports = {
  getParcels,
  getParcelCovers
}
