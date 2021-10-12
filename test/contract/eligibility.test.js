const path = require('path')
const { MessageConsumerPact } = require('@pact-foundation/pact')
const Matchers = require('@pact-foundation/pact/dsl/matchers')
const processEligibilityMessage = require('../../app/messaging/process-eligibility-message')

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
        crn: Matchers.like('11111'),
        callerId: Matchers.like('1111')
      })
      .withMetadata({
        'content-type': 'application/json'
      })
      .verify(async message => processEligibilityMessage(message))
      // check message sent
  })
})
