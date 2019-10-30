const axios = require('axios')

// fake env vars before requiring ./address
process.env.GIGYA_KEY = 'GIGYA_KEY'
process.env.GIGYA_SECRET = 'GIGYA_SECRET'

const { fetchQuickProfile, processAddresses } = require('./get-quick-profile')

const accountWithAddress = require('./fixtures/account.addresses.fixture.json')
const accountWithoutAddress = require('./fixtures/account.no-addresses.fixture.json')
const accountEmptyAddress = require('./fixtures/account.empty-addresses.fixture.json')

describe('Serverless - Gigya Get Quick Profile', () => {
  beforeEach(() => jest.resetAllMocks())

  it('should throw error if Gigya fails', done => {
    jest.spyOn(axios, 'get').mockRejectedValueOnce({ response: { data: 'Sorry, an unknown error has occurred' } })

    fetchQuickProfile({ query: { uid: 'USER_ID' } })
      .then(done.fail)
      .catch(error => {
        expect(error.error).toEqual('Sorry, an unknown error has occurred')
        done()
      })
  })

  it('should return {} if account has no addresses, and profile', done => {
    const spy = jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: accountWithoutAddress })

    fetchQuickProfile({ query: { uid: 'USER_ID' } }).then(profile => {
      expect(spy).toHaveBeenCalledWith('https://accounts.us1.gigya.com/accounts.getAccountInfo', {
        params: {
          UID: 'USER_ID',
          httpStatusCodes: true,
          apiKey: 'GIGYA_KEY',
          secret: 'GIGYA_SECRET',
        },
      })

      expect(profile).toEqual({
        firstName: 'Pinky',
        lastName: 'Ray',
        birthYear: 1980,
        birthMonth: 4,
        birthDay: 22,
        phone: '(514) 123-5555',
      })

      done()
    })
  })

  it('should return {} if account has empty addresses array, and profile', done => {
    const spy = jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: accountEmptyAddress })

    fetchQuickProfile({ query: { uid: 'USER_ID' } }).then(profile => {
      expect(spy).toHaveBeenCalledWith('https://accounts.us1.gigya.com/accounts.getAccountInfo', {
        params: {
          UID: 'USER_ID',
          httpStatusCodes: true,
          apiKey: 'GIGYA_KEY',
          secret: 'GIGYA_SECRET',
        },
      })

      expect(profile).toEqual({
        firstName: 'Pinky',
        lastName: 'Ray',
        birthYear: 1980,
        birthMonth: 4,
        birthDay: 22,
        phone: '(514) 123-5555',
      })

      done()
    })
  })

  it('should return addresses, sorted, and profile', () => {

    const profile = processAddresses(accountWithAddress)

    expect(profile).toEqual({
      addressTwo: 'Apt. 12',
      lastName: 'Ray',
      phone: '(514) 123-5555',
      alias: 'Work',
      addressOne: '10350 Bourassa',
      zipcode: 'H4N0B7',
      state: 'QC',
      firstName: 'Pinky',
      atgId: 'a1496292027980',
      city: 'Laval',
      country: 'CA',
      birthMonth: 4,
      birthDay: 22,
      birthYear: 1980
    })

  })
})
