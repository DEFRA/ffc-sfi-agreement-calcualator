const Joi = require('joi')
const mqConfig = require('./mq-config')
const dbConfig = require('./db-config')
const cacheConfig = require('./cache')
const { development, production, test } = require('./constants').environments

// Define config schema
const schema = Joi.object({
  env: Joi.string().valid(development, test, production).default(development),
  chApiGateway: process.env.NODE_ENV === 'test' ? Joi.string().default('').allow('') : Joi.string().uri().required(),
  eligibleHa: Joi.number().default(5)
})

// Build config
const config = {
  env: process.env.NODE_ENV,
  chApiGateway: process.env.CH_API_GATEWAY,
  eligibleHa: process.env.ELIGIBLE_HA
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the Joi validated value
const value = result.value

// Add some helper props
value.isDev = value.env === development
value.isTest = value.env === test
value.isProd = value.env === production

value.standardsSubscription = mqConfig.standardsSubscription
value.standardsResponseQueue = mqConfig.standardsResponseQueue
value.validateSubscription = mqConfig.validateSubscription
value.calculateSubscription = mqConfig.calculateSubscription
value.eligibilitySubscription = mqConfig.eligibilitySubscription
value.calculateResponseQueue = mqConfig.calculateResponseQueue
value.eligibilityCheckResponseQueue = mqConfig.eligibilityCheckResponseQueue
value.submitSubscription = mqConfig.submitSubscription
value.withdrawSubscription = mqConfig.withdrawSubscription
value.validateResponseTopic = mqConfig.validateResponseTopic

value.cacheConfig = cacheConfig

value.dbConfig = dbConfig

module.exports = value
