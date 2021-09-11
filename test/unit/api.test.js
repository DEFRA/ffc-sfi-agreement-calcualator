const mockGet = jest.fn(() => { return { payload: {} } })
jest.mock('@hapi/wreck', () => {
  return {
    get: mockGet
  }
})
const api = require('../../app/api')

describe('api', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('get calls get', async () => {
    await api.get('test', 1)
    expect(mockGet).toHaveBeenCalled()
  })

  test('get adds api gateway to url', async () => {
    await api.get('test', 1)
    expect(mockGet.mock.calls[0][0]).toBe('http://api-gateway/test')
  })
})
