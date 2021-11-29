const { EventSender } = require('ffc-events')
const config = require('../config').eventConfig
const createEvent = require('./create-event')
let sender

const sendEvent = async (body, type) => {
  try {
    const event = createEvent(body, type)
    await sender.sendEvents([event])
  } catch (err) {
    console.error('Unable to send event', err)
  }
}

const start = async () => {
  sender = new EventSender(config)
  await sender.connect()
}

const stop = async () => {
  await sender.closeConnection()
}

module.exports = {
  start,
  stop,
  sendEvent
}
