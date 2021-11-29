jest.mock('../../app/messaging')
const mockMessaging = require('../../app/messaging')
jest.mock('../../app/events')
const mockEvents = require('../../app/events')
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

  test('starts events', async () => {
    expect(mockEvents.start).toHaveBeenCalled()
  })
})
