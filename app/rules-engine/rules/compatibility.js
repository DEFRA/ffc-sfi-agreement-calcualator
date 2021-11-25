module.exports = {
  noPendingChanges: {
    name: 'Has no pending land changes',
    conditions: {
      all: [{
        name: 'Pending change',
        fact: 'pendingChange',
        operator: 'notEqual',
        value: true
      }]
    },
    event: {
      type: 'no-pending-changes',
      params: {
        message: 'Has no pending land changes'
      }
    }
  },
  isArableSoilLandCover: {
    name: 'is arable soil compatible land cover',
    conditions: {
      any: [{
        name: 'Arable land cover',
        fact: 'code',
        operator: 'equal',
        value: 110
      }, {
        name: 'Permanent crops land cover',
        fact: 'code',
        operator: 'equal',
        value: 140
      }, {
        name: 'Notional scrub land cover',
        fact: 'code',
        operator: 'equal',
        value: 283
      }]
    },
    event: {
      type: 'arable-soil-land-cover',
      params: {
        message: 'Is arable soil compatible land cover'
      }
    }
  },
  isImprovedGrasslandLandCover: {
    name: 'Is improved grassland land compatible cover',
    conditions: {
      any: [{
        name: 'Permanent grassland land cover',
        fact: 'code',
        operator: 'equal',
        value: 130
      }, {
        name: 'Permanent grassland land cover',
        fact: 'code',
        operator: 'equal',
        value: 131
      }, {
        name: 'Gallop land cover',
        fact: 'code',
        operator: 'equal',
        value: 131
      }, {
        name: 'Notional scrub land cover',
        fact: 'code',
        operator: 'equal',
        value: 283
      }]
    },
    event: {
      type: 'improved-grassland-land-cover',
      params: {
        message: 'Is improved grassland compatible land cover'
      }
    }
  }
}
