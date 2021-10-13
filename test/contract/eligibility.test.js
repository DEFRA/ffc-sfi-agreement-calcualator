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
const path = require('path')
const { MessageConsumerPact } = require('@pact-foundation/pact')
const Matchers = require('@pact-foundation/pact/src/dsl/matchers')
const processEligibilityMessage = require('../../app/messaging/process-eligibility-message')
const pactServiceBusAdapter = require('../pact-service-bus-adapter')

describe('receiving an eligibility check from SFI application', () => {
  let consumer

  beforeAll(async () => {
    consumer = new MessageConsumerPact({
      consumer: 'ffc-sfi-agreement-calculator',
      provider: 'ffc-sfi-apply-web',
      log: path.resolve(process.cwd(), 'test-output', 'pact.log'),
      dir: path.resolve(process.cwd(), 'test-output')
    })
  })

  test('new eligibility check sends service bus message when complete', async () => {
    await consumer
      .given('message is valid')
      .expectsToReceive('a new eligibility check')
      .withContent({
        crn: Matchers.integer(1234567890),
        callerId: Matchers.like(5089433)
      })
      .withMetadata({
        'content-type': 'application/json'
      })
      .verify(async message => pactServiceBusAdapter(processEligibilityMessage, { completeMessage: jest.fn(), abandonMessage: jest.fn() }))
    expect(mockSendMessage).toHaveBeenCalledTimes(1)
  })
})
