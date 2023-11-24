const wreck = require('@hapi/wreck')
const config = require('./config')
const FormData = require('form-data')

const get = async (url, crn, token) => {
  const apimToken = await getApimToken()
  const { payload } = await wreck.get(`${config.chApiGateway}${url}`, getConfiguration(crn, token, apimToken))
  return payload
}

const getApimToken = async () => {
  const data = new FormData()
  data.append('client_id', config.apiConfig.apimClientId)
  data.append('client_secret', config.apiConfig.apimClientSecret)
  data.append('scope', config.apiConfig.apimScope)
  data.append('grant_type', 'client_credentials')

  const response = await wreck.post(config.apiConfig.apimAuthorizationUrl, {
    headers: data.getHeaders(),
    payload: data,
    json: true
  })

  return `${response.payload.token_type} ${response.payload.access_token}`
}

const getConfiguration = (crn, token, apimToken) => {
  return {
    headers: {
      crn,
      'X-Forwarded-Authorization': token,
      'Ocp-Apim-Subscription-Key': config.apiConfig.apimOcpSubscriptionKey,
      Authorization: apimToken
    },
    json: true,
    rejectUnauthorized: false
  }
}

module.exports = {
  get
}
