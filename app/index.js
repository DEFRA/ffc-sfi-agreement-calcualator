require('./insights').setup()
const messageService = require('./messaging')
const eventService = require('./events')
const cache = require('./cache')

for (const signal of ['SIGINT', 'SIGTERM', 'SIGQUIT']) {
  process.on(signal, async () => {
    await messageService.stop()
    await eventService.stop()
    await cache.stop()
    process.exit()
  })
}

module.exports = (async function startService () {
  await cache.start()
  await eventService.start()
  await messageService.start()
}())
