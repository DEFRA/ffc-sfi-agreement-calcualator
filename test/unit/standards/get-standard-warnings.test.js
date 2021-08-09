const getStandardWarnings = require('../../../app/standards/get-standard-warnings')
let standards

describe('get standard warnings', () => {
  beforeEach(() => {
    standards = [
      {
        code: '130',
        name: 'Permanent grassland',
        parcels: []
      },
      {
        code: '110',
        name: 'Arable land',
        parcels: []
      }
    ]
  })

  test('returns empty if no parcels', () => {
    const result = getStandardWarnings(standards)
    expect(result.length).toBe(0)
  })

  test('returns empty if no warnings', () => {
    standards[0].parcels.push({ warnings: [] })
    const result = getStandardWarnings(standards)
    expect(result.length).toBe(0)
  })

  test('returns HEFER warning', () => {
    standards[0].parcels.push({ warnings: [{ HEFER: true }] })
    const result = getStandardWarnings(standards)
    expect(result.length).toBe(1)
    expect(result[0].type).toBe('HEFER')
  })

  test('returns SSSI warning', () => {
    standards[0].parcels.push({ warnings: [{ SSSI: true }] })
    const result = getStandardWarnings(standards)
    expect(result.length).toBe(1)
    expect(result[0].type).toBe('SSSI')
  })

  test('returns multiple warnings if split across parcels', () => {
    standards[0].parcels.push({ warnings: [{ SSSI: true }] })
    standards[0].parcels.push({ warnings: [{ HEFER: true }] })
    const result = getStandardWarnings(standards)
    expect(result.length).toBe(2)
    expect(result.filter(x => x.type === 'SSSI').length).toBe(1)
    expect(result.filter(x => x.type === 'HEFER').length).toBe(1)
  })
})
