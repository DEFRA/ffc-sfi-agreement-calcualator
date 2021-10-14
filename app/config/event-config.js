const Joi = require('joi')

const schema = Joi.object({
  name: Joi.string().default('ffc-sfi-agreement-calculator'),
  host: Joi.string(),
  port: Joi.string().default(9093),
  authentication: Joi.string().default('password'),
  username: Joi.string(),
  password: Joi.string(),
  mechanism: Joi.string().default('scram-sha-512'),
  topic: Joi.string(),
  clientId: Joi.string().default('ffc-sfi-agreement-calculator'),
  appInsights: Joi.object()
})

const config = {
  host: process.env.EVENT_HOST,
  port: process.env.EVENT_PORT,
  authentication: process.env.NODE_ENV === 'production' ? 'token' : 'password',
  username: process.env.EVENT_USERNAME,
  password: process.env.EVENT_PASSWORD,
  mechanism: process.env.EVENT_MECHANISM,
  topic: process.env.AGREEMENT_EVENT_TOPIC,
  clientId: process.env.EVENT_CLIENT_ID,
  appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

const value = result.value

module.exports = value
