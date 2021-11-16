module.exports = {
  pendingChange: {
    name: 'No pending land changes',
    conditions: {
      all: [{
        name: 'Pending change',
        fact: 'pendingChange',
        operator: 'notEqual',
        value: true
      }]
    },
    event: {
      type: 'pending-parcel',
      params: {
        message: 'Has no pending changes'
      }
    }
  },
  arableSoilLandCover: {
    name: 'Arable soil land cover',
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
        message: 'Has arable soil land cover'
      }
    }
  },
  improvedGrasslandLandCover: {
    name: 'Improved grassland land cover',
    conditions: {
      any: [{
        name: 'Permanent grassland land cover',
        fact: 'info',
        operator: 'hasLandCover',
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
      type: 'arable-soil-land-cover',
      params: {
        message: 'Has arable soil land cover'
      }
    }
  }
}
