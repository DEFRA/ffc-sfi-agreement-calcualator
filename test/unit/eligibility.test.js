const checkEligibility = require('../../app/eligibility')

describe('eligibility', () => {
  test('check eligibility', async () => {
    const eligibleOrganisations = await checkEligibility(1234567890, 5100153)
    console.log(eligibleOrganisations)
  })
})
