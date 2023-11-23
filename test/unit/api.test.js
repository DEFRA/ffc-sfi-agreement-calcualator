const mockGet = jest.fn(() => { return { payload: {} } })
jest.mock('@hapi/wreck', () => {
  return {
    get: mockGet
  }
})

const api = require('../../app/api')
const config = require('../../app/config')

describe('api', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('get calls get', async () => {
    await api.get('/test', 1, 'token')
    expect(mockGet).toHaveBeenCalled()
  })

  test('get adds api gateway to url', async () => {
    await api.get('/test', 1, 'token')
    expect(mockGet.mock.calls[0][0]).toBe(`${config.chApiGateway}/test`)
  })

  test('get adds headers to request', async () => {
    await api.get('/test', 1, 'token')
    expect(mockGet.mock.calls[0][1].headers).toBeDefined()
  })

  test('get adds crn to headers', async () => {
    await api.get('/test', 1, 'token')
    expect(mockGet.mock.calls[0][1].headers.crn).toBe(1)
  })

  test('get adds bearer token to headers', async () => {
    await api.get('/test', 1, 'token')
    expect(mockGet.mock.calls[0][1].headers.Authorization).toBe('Bearer token')
  })

  test('get uses json', async () => {
    await api.get('/test', 1, 'token')
    expect(mockGet.mock.calls[0][1].json).toBeTruthy()
  })

  test('get does not reject unauthorized', async () => {
    await api.get('/test', 1, 'token')
    expect(mockGet.mock.calls[0][1].rejectUnauthorized).toBeFalsy()
  })
})
