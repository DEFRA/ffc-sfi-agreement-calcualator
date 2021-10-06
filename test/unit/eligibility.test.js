const nock = require('nock')
const checkEligibility = require('../../app/eligibility')
const { chApiGateway } = require('../../app/config')

const callerId = 123456
const crn = 1234567890
const organisationId = 1234567
const name = 'Title Forename Lastname'
const sbi = 123456789

let responseMock
let responseOrganisationsMock
let responseLandCover
let responseOrganisationMock

describe('eligibility', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    responseMock = [
      {
        sbi,
        name,
        organisationId,
        address: 'address1, address2, address3, postalCode'
      }
    ]

    responseOrganisationsMock = { _data: [{ id: organisationId, name, sbi }] }
    responseLandCover = [{ id: 'SJ12345678', info: [{ code: '110', name: 'Arable Land', area: 60000 }] }]
    responseOrganisationMock = { _data: { id: organisationId, name, sbi, address: { address1: 'address1', address2: 'address2', address3: 'address3', postalCode: 'postalCode' } } }
  })

  afterAll(() => {
    nock.cleanAll()
  })

  test('check eligibility returns empty array - No organisations found', async () => {
    responseMock = []
    responseOrganisationsMock = { _data: [] }

    nock(chApiGateway)
      .get(`/organisation/person/${callerId}/summary?search=`)
      .reply(200, responseOrganisationsMock)

    const eligibleOrganisations = await checkEligibility(crn, callerId)
    expect(eligibleOrganisations).toEqual(responseMock)
  })

  test('check eligibility returns empty array - Land < 5ha', async () => {
    responseMock = []
    responseLandCover = [{ id: 'SJ12345678', info: [{ code: '110', name: 'Arable Land', area: 0 }] }]
    nock(chApiGateway)
      .get(`/organisation/person/${callerId}/summary?search=`)
      .reply(200, responseOrganisationsMock)

    nock(chApiGateway)
      .get(`/lms/organisation/${organisationId}/land-covers`)
      .reply(200, responseLandCover)

    const eligibleOrganisations = await checkEligibility(crn, callerId)
    expect(eligibleOrganisations).toEqual(responseMock)
  })

  test('check eligibility returns array - Land calculated over 5ha', async () => {
    nock(chApiGateway)
      .get(`/organisation/person/${callerId}/summary?search=`)
      .reply(200, responseOrganisationsMock)

    responseLandCover = [{ id: 'SJ80778858', info: [{ code: '110', name: 'Arable Land', area: 300 }, { code: '130', name: 'Permanent Grasslands', area: 300 }] }]

    nock(chApiGateway)
      .get(`/lms/organisation/${organisationId}/land-covers`)
      .reply(200, responseLandCover)

    nock(chApiGateway)
      .get(`/organisation/${organisationId}`)
      .reply(200, responseOrganisationMock)

    const eligibleOrganisations = await checkEligibility(crn, callerId)
    expect(eligibleOrganisations).toEqual(responseMock)
  })

  test('check eligibility', async () => {
    nock(chApiGateway)
      .get(`/organisation/person/${callerId}/summary?search=`)
      .reply(200, responseOrganisationsMock)

    nock(chApiGateway)
      .get(`/lms/organisation/${organisationId}/land-covers`)
      .reply(200, responseLandCover)

    nock(chApiGateway)
      .get(`/organisation/${organisationId}`)
      .reply(200, responseOrganisationMock)

    const eligibleOrganisations = await checkEligibility(crn, callerId)
    expect(eligibleOrganisations).toEqual(responseMock)
  })
})
