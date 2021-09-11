const { calculatePaymentRates } = require('../../app/calculate')

describe('calculate payment rates', () => {
  test('calculates introductory rate for arable', () => {
    const result = calculatePaymentRates(110, [{ area: 100 }])
    expect(result.Introductory.paymentAmount).toBe('2600.00')
  })

  test('calculates intermediate rate for arable', () => {
    const result = calculatePaymentRates(110, [{ area: 100 }])
    expect(result.Intermediate.paymentAmount).toBe('4100.00')
  })

  test('calculates advanced rate for arable', () => {
    const result = calculatePaymentRates(110, [{ area: 100 }])
    expect(result.Advanced.paymentAmount).toBe('6000.00')
  })
})
