const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  socket: Joi.object({
    host: Joi.string(),
    port: Joi.number().default(6379),
    password: Joi.string().allow(''),
    tls: Joi.boolean().default(false)
  }),
  partition: Joi.string().default('ffc-sfi-agreement-calculator'),
  ttl: Joi.number().default(3600 * 1000), // 1 hour,
  standardsCache: Joi.string().default('standards'),
  calculateCache: Joi.string().default('calculate'),
  validateCache: Joi.string().default('validate')
})

// Build config
const config = {
  socket: {
    host: process.env.REDIS_HOSTNAME,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    tls: process.env.NODE_ENV === 'production'
  },
  partition: process.env.REDIS_PARTITION,
  ttl: process.env.REDIS_TTL,
  standardsCache: process.env.REDIS_STANDARDS_CACHE,
  calculateCache: process.env.REDIS_CALCULATE_CACHE,
  validateCache: process.env.REDIS_VALIDATE_CACHE
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

module.exports = value
