const config = require('../config')
const processStandardsMessage = require('./process-standards-message')
const processEligibilityMessage = require('./process-eligibility-message')
const processValidateMessage = require('./process-validate-message')
const processCalculateMessage = require('./process-calculate-message')
const processSubmitMessage = require('./process-submit-message')
const processWithdrawMessage = require('./process-withdraw-message')
const processParcelMessage = require('./process-parcel-message')
const processParcelSpatialMessage = require('./process-parcel-spatial-message')
const processParcelStandardMessage = require('./process-parcel-standard-message')
const { MessageReceiver } = require('ffc-messaging')
let standardsReceiver
let eligibilityReceiver
let validateReceiver
let calculateReceiver
let submitReceiver
let withdrawReceiver
let parcelReceiver
let parcelSpatialReceiver
let parcelStandardReceiver

const start = async () => {
  const standardsAction = message => processStandardsMessage(message, standardsReceiver)
  standardsReceiver = new MessageReceiver(config.standardsSubscription, standardsAction)
  await standardsReceiver.subscribe()

  const eligibilityAction = message => processEligibilityMessage(message, eligibilityReceiver)
  eligibilityReceiver = new MessageReceiver(config.eligibilitySubscription, eligibilityAction)
  await eligibilityReceiver.subscribe()

  const validateAction = message => processValidateMessage(message, validateReceiver)
  validateReceiver = new MessageReceiver(config.validateSubscription, validateAction)
  await validateReceiver.subscribe()

  const calculateAction = message => processCalculateMessage(message, calculateReceiver)
  calculateReceiver = new MessageReceiver(config.calculateSubscription, calculateAction)
  await calculateReceiver.subscribe()

  const submitAction = message => processSubmitMessage(message, submitReceiver)
  submitReceiver = new MessageReceiver(config.submitSubscription, submitAction)
  await submitReceiver.subscribe()

  const withdrawAction = message => processWithdrawMessage(message, withdrawReceiver)
  withdrawReceiver = new MessageReceiver(config.withdrawSubscription, withdrawAction)
  await withdrawReceiver.subscribe()

  const parcelAction = message => processParcelMessage(message, parcelReceiver)
  parcelReceiver = new MessageReceiver(config.parcelSubscription, parcelAction)
  await parcelReceiver.subscribe()

  const parcelSpatialAction = message => processParcelSpatialMessage(message, parcelSpatialReceiver)
  parcelSpatialReceiver = new MessageReceiver(config.parcelSpatialSubscription, parcelSpatialAction)
  await parcelSpatialReceiver.subscribe()

  const parcelStandardAction = message => processParcelStandardMessage(message, parcelStandardReceiver)
  parcelStandardReceiver = new MessageReceiver(config.parcelStandardSubscription, parcelStandardAction)
  await parcelStandardReceiver.subscribe()

  console.info('Ready to receive messages')
}

const stop = async () => {
  await standardsReceiver.closeConnection()
  await eligibilityReceiver.closeConnection()
  await validateReceiver.closeConnection()
  await calculateReceiver.closeConnection()
  await submitReceiver.closeConnection()
  await withdrawReceiver.closeConnection()
  await parcelReceiver.closeConnection()
  await parcelSpatialReceiver.closeConnection()
  await parcelStandardReceiver.closeConnection()
}

module.exports = { start, stop }
