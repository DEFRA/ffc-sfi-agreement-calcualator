module.exports = {
  hasSufficientBpsEntitlements: {
    name: 'Has sufficient BPS entitlements',
    conditions: {
      all: [{
        name: 'BPS entitlements',
        fact: 'bpsEntitlements',
        operator: 'greaterThanInclusive',
        value: 5
      }]
    },
    event: {
      type: 'bps-entitlements',
      params: {
        message: 'Has sufficient BPS entitlements'
      }
    }
  },
  hasSufficientBpsLand: {
    name: 'Has sufficient BPS eligible land',
    conditions: {
      all: [{
        name: 'BPS eligible land',
        fact: 'bpsEligibleLand',
        operator: 'greaterThanInclusive',
        value: 500
      }]
    },
    event: {
      type: 'bps-land',
      params: {
        message: 'Has sufficient BPS eligible land'
      }
    }
  }
}
