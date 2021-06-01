const hapi = require('@hapi/hapi')
const config = require('./config')
const messageService = require('./messaging')

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    },
    router: {
      stripTrailingSlash: true
    }
  })

  // Register the plugins
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/error-pages'))

  if (config.isDev) {
    await server.register(require('blipp'))
    await server.register(require('./plugins/logging'))
  }

  await messageService.start()

  process.on('SIGTERM', async function () {
    await messageService.stop()
    process.exit(0)
  })

  process.on('SIGINT', async function () {
    await messageService.stop()
    process.exit(0)
  })

  return server
}

module.exports = createServer
