const wreck = require('@hapi/wreck')
const config = require('../config')
const { apiGatewayEndpoint } = config

async function get (url, callerId) {
  const { payload } = await wreck.get(`${apiGatewayEndpoint}${url}`, getConfiguration(callerId))
  return payload
}

function getConfiguration (callerId) {
  return {
    headers: {
      callerId
    },
    json: true
  }
}

module.exports = {
  get
}
