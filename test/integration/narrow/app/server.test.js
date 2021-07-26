describe('Server tests', () => {
  jest.mock('ffc-messaging')
  jest.mock('../../../../app/cache')
  let createServer
  let server

  test('createServer returns server', async () => {
    createServer = require('../../../../app/server')
    server = await createServer()

    expect(server).toBeDefined()
  })

  test('createServer returns server in development', async () => {
    createServer = require('../../../../app/server')
    server = await createServer()

    expect(server).toBeDefined()
  })

  beforeEach(() => {
    jest.resetModules()
    jest.mock('../../../../app/plugins/router', () => {
      return {
        plugin: {
          name: 'mockrouter',
          register: () => {}
        }
      }
    })
  })
})
