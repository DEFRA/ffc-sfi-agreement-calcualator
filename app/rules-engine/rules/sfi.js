module.exports = {
  bpsEntitlements: {
    name: 'BPS entitlements',
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
  bpsLand: {
    name: 'BPS eligible land',
    conditions: {
      all: [{
        name: 'BPS eligible hectares',
        fact: 'bpsEligibleHectares',
        operator: 'greaterThanInclusive',
        value: 5
      }]
    },
    event: {
      type: 'bps-land',
      params: {
        message: 'Has sufficient eligible land'
      }
    }
  }
}
