const joi = require('joi')

const mqSchema = joi.object({
  messageQueue: {
    host: joi.string().default('localhost'),
    useCredentialChain: joi.bool().default(false),
    type: joi.string(),
    appInsights: joi.object()
  },
  eligibilitySubscription: {
    name: joi.string().default('ffc-sfi-eligibility-check'),
    address: joi.string().default('eligibility'),
    username: joi.string(),
    password: joi.string(),
    topic: joi.string()
  },
  standardsSubscription: {
    name: joi.string().default('ffc-sfi-standards-request'),
    address: joi.string().default('standards'),
    username: joi.string(),
    password: joi.string(),
    topic: joi.string()
  },
  validateSubscription: {
    name: joi.string().default('ffc-sfi-agreement-validate'),
    address: joi.string().default('validate'),
    username: joi.string(),
    password: joi.string(),
    topic: joi.string()
  },
  calculateSubscription: {
    name: joi.string().default('ffc-sfi-agreement-calculate'),
    address: joi.string().default('calculate'),
    username: joi.string(),
    password: joi.string(),
    topic: joi.string()
  },
  submitSubscription: {
    name: joi.string().default('ffc-sfi-agreement-submit'),
    address: joi.string().default('submit'),
    username: joi.string(),
    password: joi.string(),
    topic: joi.string()
  },
  withdrawSubscription: {
    name: joi.string().default('ffc-sfi-agreement-withdraw'),
    address: joi.string().default('withdraw'),
    username: joi.string(),
    password: joi.string(),
    topic: joi.string()
  }
})
const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    useCredentialChain: process.env.NODE_ENV === 'production',
    type: 'subscription',
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined
  },
  eligibilitySubscription: {
    name: process.env.ELIGIBILITY_SUBSCRIPTION_NAME,
    address: process.env.ELIGIBILITY_SUBSCRIPTION_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    topic: process.env.ELIGIBILITY_TOPIC_ADDRESS
  },
  standardsSubscription: {
    name: process.env.STANDARDS_SUBSCRIPTION_NAME,
    address: process.env.STANDARDS_SUBSCRIPTION_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    topic: process.env.STANDARDS_TOPIC_ADDRESS
  },
  validateSubscription: {
    name: process.env.VALIDATE_SUBSCRIPTION_NAME,
    address: process.env.VALIDATE_SUBSCRIPTION_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    topic: process.env.VALIDATE_TOPIC_ADDRESS
  },
  calculateSubscription: {
    name: process.env.CALCULATE_SUBSCRIPTION_NAME,
    address: process.env.CALCULATE_SUBSCRIPTION_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    topic: process.env.CALCULATE_TOPIC_ADDRESS
  },
  submitSubscription: {
    name: process.env.SUBMIT_SUBSCRIPTION_NAME,
    address: process.env.SUBMIT_SUBSCRIPTION_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    topic: process.env.SUBMIT_TOPIC_ADDRESS
  },
  withdrawSubscription: {
    name: process.env.WITHDRAW_SUBSCRIPTION_NAME,
    address: process.env.WITHDRAW_SUBSCRIPTION_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
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

const eligibilitySubscription = { ...mqResult.value.messageQueue, ...mqResult.value.eligibilitySubscription }
const standardsSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.standardsSubscription }
const validateSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.validateSubscription }
const calculateSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.calculateSubscription }
const submitSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.submitSubscription }
const withdrawSubscription = { ...mqResult.value.messageQueue, ...mqResult.value.withdrawSubscription }

module.exports = {
  eligibilitySubscription,
  standardsSubscription,
  validateSubscription,
  calculateSubscription,
  submitSubscription,
  withdrawSubscription
}
