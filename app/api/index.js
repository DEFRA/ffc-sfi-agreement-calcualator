const wreck = require('@hapi/wreck')
const config = require('../config')

async function get (url, token) {
  const { payload } = await wreck.get(`${config.apiGatewayEndpoint}${url}`, getConfiguration(token))
  return payload
}

async function post (url, data, token) {
  const { payload } = await wreck.post(`${config.apiGatewayEndpoint}${url}`, {
    payload: data,
    ...getConfiguration(token)
  })
  return payload
}

function getConfiguration (token) {
  return {
    headers: {
      Authorization: token ?? ''
    },
    json: true
  }
}

module.exports = {
  get,
  post
}
