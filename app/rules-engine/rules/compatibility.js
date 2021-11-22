module.exports = {
  pendingChange: {
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
      type: 'pending-parcel',
      params: {
        message: 'Has no pending changes'
      }
    }
  },
  arableSoilLandCover: {
    name: 'Has arable soil compatible land cover',
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
        message: 'Has arable soil compatible land cover'
      }
    }
  },
  improvedGrasslandLandCover: {
    name: 'Has improved grassland land compatible cover',
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
      type: 'arable-soil-land-cover',
      params: {
        message: 'Has improved grassland compatible land cover'
      }
    }
  }
}
