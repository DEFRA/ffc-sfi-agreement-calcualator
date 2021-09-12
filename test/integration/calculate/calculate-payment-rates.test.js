const { calculatePaymentRates } = require('../../../app/calculate')
const db = require('../../../app/data')
let scheme
let standard
let levels
let rates

describe('calculate payment rates', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    scheme = {
      schemeId: 1,
      name: 'SFI'
    }

    standard = {
      standardId: 1,
      schemeId: 1,
      name: 'Arable and horticultural soils',
      code: 110
    }

    levels = [{
      levelId: 1,
      standardId: 1,
      name: 'Introductory'
    }, {
      levelId: 2,
      standardId: 1,
      name: 'Intermediate'
    }, {
      levelId: 3,
      standardId: 1,
      name: 'Advanced'
    }]

    rates = [{
      rateId: 1,
      levelId: 1,
      rate: 2600,
      startDate: new Date(2021, 2, 1)
    }, {
      rateId: 2,
      levelId: 2,
      rate: 4100,
      startDate: new Date(2021, 2, 1)
    }, {
      rateId: 3,
      levelId: 3,
      rate: 6000,
      startDate: new Date(2021, 2, 1)
    }]

    await db.scheme.create(scheme)
    await db.standard.create(standard)
    await db.level.bulkCreate(levels)
    await db.rate.bulkCreate(rates)
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('calculates introductory payment', async () => {
    const result = await calculatePaymentRates(110, [{ area: 100 }])
    expect(result.Introductory.paymentAmount).toBe('2600.00')
  })

  test('calculates intermediate payment', async () => {
    const result = await calculatePaymentRates(110, [{ area: 100 }])
    expect(result.Intermediate.paymentAmount).toBe('4100.00')
  })

  test('calculates advanced payment', async () => {
    const result = await calculatePaymentRates(110, [{ area: 100 }])
    expect(result.Advanced.paymentAmount).toBe('6000.00')
  })

  test('calculates introductory rate', async () => {
    const result = await calculatePaymentRates(110, [{ area: 100 }])
    expect(result.Introductory.rate).toBe('26.00')
  })

  test('calculates intermediate rate', async () => {
    const result = await calculatePaymentRates(110, [{ area: 100 }])
    expect(result.Intermediate.rate).toBe('41.00')
  })

  test('calculates advanced rate', async () => {
    const result = await calculatePaymentRates(110, [{ area: 100 }])
    expect(result.Advanced.rate).toBe('60.00')
  })

  test('calculates multiple parcels', async () => {
    const result = await calculatePaymentRates(110, [{ area: 100 }, { area: 100 }])
    expect(result.Introductory.paymentAmount).toBe('5200.00')
  })

  test('calculates decimal parcel', async () => {
    const result = await calculatePaymentRates(110, [{ area: 100.1 }])
    expect(result.Introductory.paymentAmount).toBe('2602.60')
  })

  test('calculates multiple decimal parcels', async () => {
    const result = await calculatePaymentRates(110, [{ area: 100.1 }, { area: 100.2 }])
    expect(result.Introductory.paymentAmount).toBe('5207.80')
  })
})
