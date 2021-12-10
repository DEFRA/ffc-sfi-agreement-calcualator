const { get } = require('../api')

const getEntitlements = async (organisationId, callerId) => {
  const url = `/SitiAgriApi/entitlements/grouped/${organisationId}`
  const data = await get(url, callerId) ?? 0
  return data?.data.reduce((acc, { quantityOwned }) => acc + quantityOwned, 0)
}

module.exports = {
  getEntitlements
}
