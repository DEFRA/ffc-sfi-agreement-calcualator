const wreck = require('@hapi/wreck')
const config = require('./config')
const { chApiGateway } = config

const get = async (url, callerId) => {
  const { payload } = await wreck.get(`${chApiGateway}${url}`, getConfiguration(callerId))
  return payload
}

const getConfiguration = (callerId) => {
  return {
    headers: {
      callerId
    },
    json: true,
    rejectUnauthorized: false
  }
}

module.exports = {
  get
}
