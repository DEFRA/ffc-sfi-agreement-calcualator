const Joi = require('joi')

const schema = Joi.object().keys({
  apimClientId: Joi.string().required(),
  apimClientSecret: Joi.string().required(),
  apimScope: Joi.string().required(),
  apimOcpSubscriptionKey: Joi.string().required(),
  apimAuthorizationUrl: Joi.string().required()
})

const config = {
  apimClientId: process.env.APIM_CLIENT_ID,
  apimClientSecret: process.env.APIM_CLIENT_SECRET,
  apimScope: process.env.APIM_SCOPE,
  apimOcpSubscriptionKey: process.env.APIM_OCP_SUBSCRIPTION_KEY,
  apimAuthorizationUrl: process.env.APIM_AUTHORIZATION_URL
}

const { error, value } = schema.validate(config)

if (error) {
  throw new Error(`The API config is invalid. ${error.message}`)
}

module.exports = value
