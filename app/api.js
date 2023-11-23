const wreck = require('@hapi/wreck')
const config = require('./config')
const { chApiGateway } = config

const get = async (url, crn, token) => {
  const { payload } = await wreck.get(`${chApiGateway}${url}`, getConfiguration(crn, token))
  return payload
}

const getConfiguration = (crn, token) => {
  return {
    headers: {
      crn,
      Authorization: `Bearer ${token}`
    },
    json: true,
    rejectUnauthorized: false
  }
}

module.exports = {
  get
}
