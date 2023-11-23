const { get } = require('../api')

const getEntitlements = async (organisationId, crn, token) => {
  const url = `/SitiAgriApi/entitlements/grouped/${organisationId}`
  const data = await get(url, crn, token)
  return data?.data?.reduce((acc, { quantityOwned }) => acc + quantityOwned, 0) ?? 0
}

module.exports = getEntitlements
