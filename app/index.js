require('./insights').setup()
const messageService = require('./messaging')
const cache = require('./cache')

for (const signal of ['SIGINT', 'SIGTERM', 'SIGQUIT']) {
  process.on(signal, async () => {
    await messageService.stop()
    process.exit()
  })
}

module.exports = (async function startService () {
  await cache.start()
  await messageService.start()
}())
