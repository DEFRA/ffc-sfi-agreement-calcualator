const { calculatePaymentRates } = require('../../app/calculate')

describe('calculate payment rates', () => {
  test('calculates introductory payment for arable soil', () => {
    const result = calculatePaymentRates(110, [{ area: 100 }])
    expect(result.Introductory.paymentAmount).toBe('2600.00')
  })

  test('calculates intermediate payment for arable soil', () => {
    const result = calculatePaymentRates(110, [{ area: 100 }])
    expect(result.Intermediate.paymentAmount).toBe('4100.00')
  })

  test('calculates advanced payment for arable soil', () => {
    const result = calculatePaymentRates(110, [{ area: 100 }])
    expect(result.Advanced.paymentAmount).toBe('6000.00')
  })

  test('calculates introductory rate for arable soil', () => {
    const result = calculatePaymentRates(110, [{ area: 100 }])
    expect(result.Introductory.rate).toBe('26.00')
  })

  test('calculates intermediate rate for arable soil', () => {
    const result = calculatePaymentRates(110, [{ area: 100 }])
    expect(result.Intermediate.rate).toBe('41.00')
  })

  test('calculates advanced rate for arable soil', () => {
    const result = calculatePaymentRates(110, [{ area: 100 }])
    expect(result.Advanced.rate).toBe('60.00')
  })
})
