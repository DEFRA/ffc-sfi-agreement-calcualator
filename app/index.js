require('./insights').setup()
const messageService = require('./messaging')
const { setup: setupCache } = require('./cache')

process.on('SIGTERM', async () => {
  await messageService.stop()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await messageService.stop()
  process.exit(0)
})

module.exports = (async function startService () {
  await setupCache()
  await messageService.start()
}())
