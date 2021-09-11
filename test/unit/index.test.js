jest.mock('../../app/messaging')
const mockMessaging = require('../../app/messaging')
jest.mock('../../app/cache')
const mockCache = require('../../app/cache')

describe('app', () => {
  beforeEach(() => {
    require('../../app')
  })

  test('starts cache', async () => {
    expect(mockCache.start).toHaveBeenCalled()
  })

  test('starts messaging', async () => {
    expect(mockMessaging.start).toHaveBeenCalled()
  })
})
