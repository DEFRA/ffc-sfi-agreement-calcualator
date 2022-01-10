const path = require('path')
const { MessageConsumerPact } = require('@pact-foundation/pact')
const Matchers = require('@pact-foundation/pact/src/dsl/matchers')
const processEligibilityMessage = require('../../app/messaging/process-eligibility-message')
const cache = require('../../app/cache')
const pactServiceBusAdapter = require('../pact-service-bus-adapter')
const mockSendMessage = jest.fn()
jest.mock('ffc-messaging', () => {
  return {
    MessageSender: jest.fn().mockImplementation(() => {
      return {
        sendMessage: mockSendMessage,
        closeConnection: jest.fn()
      }
    })
  }
})
jest.mock('../../app/eligibility')

describe('receiving an eligibility check from SFI application', () => {
  let consumer
  let receiver

  beforeAll(async () => {
    await cache.start()
    consumer = new MessageConsumerPact({
      consumer: 'ffc-sfi-agreement-calculator',
      provider: 'ffc-sfi-apply-web',
      log: path.resolve(process.cwd(), 'test-output', 'pact.log'),
      dir: path.resolve(process.cwd(), 'test-output')
    })
    receiver = { completeMessage: jest.fn(), abandonMessage: jest.fn() }
  })

  afterAll(async () => {
    await cache.flushAll()
    await cache.stop()
  })

  test('new eligibility check sends response message and sets message complete', async () => {
    await consumer
      .given('message is valid')
      .expectsToReceive('a new eligibility check')
      .withContent({
        crn: Matchers.integer(1234567890),
        callerId: Matchers.like(5089433)
      })
      .withMetadata({
        'content-type': 'application/json',
        'correlation-id': 'f492c3f4-03b3-455b-8de9-b9b05e025434',
        'message-id': '0373821b-dd8c-4c3a-9fd8-f384504aa7bc'
      })
      .verify(pactServiceBusAdapter(processEligibilityMessage, receiver))
    expect(mockSendMessage).toHaveBeenCalledTimes(1)
    expect(receiver.completeMessage).toHaveBeenCalledTimes(1)
  })
})
