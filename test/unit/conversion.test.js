const { convertToInteger, convertToDecimal } = require('../../app/conversion')

describe('conversion', () => {
  test('converts 100 to integer', () => {
    const result = convertToInteger(100)
    expect(result).toEqual(10000)
  })

  test('converts 100.10 to integer', () => {
    const result = convertToInteger(100.10)
    expect(result).toEqual(10010)
  })

  test('converts 100.1 to integer', () => {
    const result = convertToInteger(100.1)
    expect(result).toEqual(10010)
  })

  test('converts 100 to integer if string', () => {
    const result = convertToInteger('100')
    expect(result).toEqual(10000)
  })

  test('converts 100.10 to integer if string', () => {
    const result = convertToInteger('100.10')
    expect(result).toEqual(10010)
  })

  test('converts 100.1 to integer if string', () => {
    const result = convertToInteger('100.1')
    expect(result).toEqual(10010)
  })

  test('converts 10000 to decimal', () => {
    const result = convertToDecimal(10000)
    expect(result).toEqual('100.00')
  })

  test('converts 10010 to decimal', () => {
    const result = convertToDecimal(10010)
    expect(result).toEqual('100.10')
  })
})
