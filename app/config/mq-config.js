const Joi = require('joi')

const mqSchema = Joi.object({
  messageQueue: {
    host: Joi.string(),
    useCredentialChain: Joi.bool().default(false),
    type: Joi.string(),
    appInsights: Joi.object(),
    username: Joi.string(),
    password: Joi.string()
  },
  standardsSubscription: {
    address: Joi.string(),
    topic: Joi.string()
  },
  standardsResponseQueue: {
    address: Joi.string()
  },
  validateSubscription: {
    address: Joi.string(),
    topic: Joi.string()
  },
  validateResponseTopic: {
    address: Joi.string()
  },
  calculateSubscription: {
    address: Joi.string(),
    topic: Joi.string()
  },
  eligibilitySubscription: {
    address: Joi.string(),
    topic: Joi.string()
  },
  calculateResponseQueue: {
    address: Joi.string()
  },
  eligibilityCheckResponseQueue: {
    address: Joi.string()
  },
  submitSubscription: {
    address: Joi.string(),
    topic: Joi.string()
  },
  withdrawSubscription: {
    address: Joi.string(),
    topic: Joi.string()
  },
  parcelSubscription: {
    address: Joi.string(),
    topic: Joi.string()
  },
  parcelResponseQueue: {
    address: Joi.string()
  }
})
const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    useCredentialChain: process.env.NODE_ENV === 'production',
    type: 'subscription',
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD
  },
  standardsSubscription: {
    address: process.env.STANDARDS_SUBSCRIPTION_ADDRESS,
    topic: process.env.STANDARDS_TOPIC_ADDRESS
  },
  standardsResponseQueue: {
    address: process.env.STANDARDSRESPONSE_QUEUE_ADDRESS
  },
  validateSubscription: {
    address: process.env.VALIDATE_SUBSCRIPTION_ADDRESS,
    topic: process.env.VALIDATE_TOPIC_ADDRESS
  },
  validateResponseTopic: {
    address: process.env.VALIDATION_TOPIC_ADDRESS
  },
  calculateSubscription: {
    address: process.env.CALCULATE_SUBSCRIPTION_ADDRESS,
    topic: process.env.CALCULATE_TOPIC_ADDRESS
  },
  eligibilitySubscription: {
    address: process.env.ELIGIBILITY_SUBSCRIPTION_ADDRESS,
    topic: process.env.ELIGIBILITY_TOPIC_ADDRESS
  },
  calculateResponseQueue: {
    address: process.env.CALCULATERESPONSE_QUEUE_ADDRESS
  },
  eligibilityCheckResponseQueue: {
    address: process.env.ELIGIBILITYRESPONSE_QUEUE_ADDRESS
  },
  submitSubscription: {
    address: process.env.SUBMIT_SUBSCRIPTION_ADDRESS,
    topic: process.env.SUBMIT_TOPIC_ADDRESS
  },
  withdrawSubscription: {
    address: process.env.WITHDRAW_SUBSCRIPTION_ADDRESS,
    topic: process.env.WITHDRAW_TOPIC_ADDRESS
  },
  parcelSubscription: {
    address: process.env.PARCELSPATIAL_SUBSCRIPTION_ADDRESS,
    topic: process.env.PARCELSPATIAL_TOPIC_ADDRESS
  },
  parcelResponseQueue: {
    address: process.env.PARCELSPATIALRESPONSE_QUEUE_ADDRESS
  }
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const standardsSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.standardsSubscription }
const standardsResponseQueue = { ...mqResult.value.messageQueue, ...mqResult.value.standardsResponseQueue }
const validateSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.validateSubscription }
const calculateSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.calculateSubscription }
const eligibilitySubscription = { ...mqResult.value.messageQueue, ...mqResult.value.eligibilitySubscription }
const calculateResponseQueue = { ...mqResult.value.messageQueue, ...mqResult.value.calculateResponseQueue }
const eligibilityCheckResponseQueue = { ...mqResult.value.messageQueue, ...mqResult.value.eligibilityCheckResponseQueue }
const submitSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.submitSubscription }
const withdrawSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.withdrawSubscription }
const validateResponseTopic = { ...mqResult.value.messageQueue, ...mqResult.value.validateResponseTopic }
const parcelSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.parcelSubscription }
const parcelResponseQueue = { ...mqResult.value.messageQueue, ...mqResult.value.parcelResponseQueue }

module.exports = {
  standardsSubscription,
  standardsResponseQueue,
  validateSubscription,
  calculateSubscription,
  eligibilitySubscription,
  calculateResponseQueue,
  eligibilityCheckResponseQueue,
  submitSubscription,
  withdrawSubscription,
  validateResponseTopic,
  parcelSubscription,
  parcelResponseQueue
}
