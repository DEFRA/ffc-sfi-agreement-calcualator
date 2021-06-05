const Joi = require('joi')
const mqConfig = require('./mq-config')
const dbConfig = require('./db-config')
const cacheConfig = require('./cache')
const { development, production, test } = require('./constants').environments

// Define config schema
const schema = Joi.object({
  port: Joi.number().default(3003),
  env: Joi.string().valid(development, test, production).default(development)
})

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV
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

value.eligibilitySubscription = mqConfig.eligibilitySubscription
value.standardsSubscription = mqConfig.standardsSubscription
value.validateSubscription = mqConfig.validateSubscription
value.calculateSubscription = mqConfig.calculateSubscription
value.submitSubscription = mqConfig.submitSubscription
value.withdrawSubscription = mqConfig.withdrawSubscription

value.cacheConfig = cacheConfig
// Don't try to connect to Redis for testing or if Redis not available
value.useRedis = !value.isTest && value.cacheConfig.redisCatboxOptions.host !== undefined

if (!value.useRedis) {
  console.info('Redis disabled, using in memory cache')
}

value.dbConfig = dbConfig

module.exports = value
