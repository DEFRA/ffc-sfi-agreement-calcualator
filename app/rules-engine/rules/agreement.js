module.exports = {
  hasSufficientLandCover: {
    name: 'Has sufficient land cover',
    conditions: {
      all: [{
        name: 'Has sufficient land cover',
        fact: 'agreementLandCover',
        operator: 'lessThanInclusive',
        value: {
          fact: 'standardLandCover'
        }
      }]
    },
    event: {
      type: 'sufficient-land-cover',
      params: {
        message: 'Has sufficient land cover'
      }
    }
  }
}
