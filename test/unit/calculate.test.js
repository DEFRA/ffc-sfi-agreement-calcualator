const { calculatePaymentRates } = require('../../app/calculate')

describe('calculate payment rates', () => {
  test('calculates introductory payment', () => {
    const result = calculatePaymentRates(110, [{ area: 100 }])
    expect(result.Introductory.paymentAmount).toBe('2600.00')
  })

  test('calculates intermediate payment', () => {
    const result = calculatePaymentRates(110, [{ area: 100 }])
    expect(result.Intermediate.paymentAmount).toBe('4100.00')
  })

  test('calculates advanced payment', () => {
    const result = calculatePaymentRates(110, [{ area: 100 }])
    expect(result.Advanced.paymentAmount).toBe('6000.00')
  })

  test('calculates introductory rate', () => {
    const result = calculatePaymentRates(110, [{ area: 100 }])
    expect(result.Introductory.rate).toBe('26.00')
  })

  test('calculates intermediate rate', () => {
    const result = calculatePaymentRates(110, [{ area: 100 }])
    expect(result.Intermediate.rate).toBe('41.00')
  })

  test('calculates advanced rate', () => {
    const result = calculatePaymentRates(110, [{ area: 100 }])
    expect(result.Advanced.rate).toBe('60.00')
  })
})
