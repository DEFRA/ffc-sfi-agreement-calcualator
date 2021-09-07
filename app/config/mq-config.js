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
  standardsResponseTopic: {
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
  calculateResponseTopic: {
    address: Joi.string()
  },
  submitSubscription: {
    address: Joi.string(),
    topic: Joi.string()
  },
  withdrawSubscription: {
    address: Joi.string(),
    topic: Joi.string()
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
  standardsResponseTopic: {
    address: process.env.STANDARDSRESPONSE_TOPIC_ADDRESS
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
  calculateResponseTopic: {
    address: process.env.CALCULATERESPONSE_TOPIC_ADDRESS
  },
  submitSubscription: {
    address: process.env.SUBMIT_SUBSCRIPTION_ADDRESS,
    topic: process.env.SUBMIT_TOPIC_ADDRESS
  },
  withdrawSubscription: {
    address: process.env.WITHDRAW_SUBSCRIPTION_ADDRESS,
    topic: process.env.WITHDRAW_TOPIC_ADDRESS
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
const standardsResponseTopic = { ...mqResult.value.messageQueue, ...mqResult.value.standardsResponseTopic }
const validateSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.validateSubscription }
const calculateSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.calculateSubscription }
const calculateResponseTopic = { ...mqResult.value.messageQueue, ...mqResult.value.calculateResponseTopic }
const submitSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.submitSubscription }
const withdrawSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.withdrawSubscription }
const validateResponseTopic = { ...mqResult.value.messageQueue, ...mqResult.value.validateResponseTopic }

module.exports = {
  standardsSubscription,
  standardsResponseTopic,
  validateSubscription,
  calculateSubscription,
  calculateResponseTopic,
  submitSubscription,
  withdrawSubscription,
  validateResponseTopic
}
