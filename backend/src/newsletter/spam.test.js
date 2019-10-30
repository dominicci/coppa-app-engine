const axios = require('axios')
const spam = require('./spam')
const { GALE_URL } = require('../config')

describe('Serverless - Newsletter Spam', () => {
  beforeEach(() => jest.resetAllMocks())

  it('should throw error if ATG throws', done => {
    jest.spyOn(axios, 'get').mockRejectedValueOnce({ response: { data: 'Sorry, an unknown error has occurred' } })

    spam
      .spam({})
      .then(() => done())
      .catch(error => {
        expect(error).toEqual('Sorry, an unknown error has occurred')
        done()
      })
  })

  it('should throw if Gigya throws', done => {
    jest.spyOn(axios, 'get').mockRejectedValueOnce({ response: { data: { statusCode: 400 } } })
    jest.spyOn(axios, 'put').mockResolvedValueOnce({ data: {} })

    spam
      .spam({})
      .then(() => done())
      .catch(error => {
        expect(error).toEqual({ statusCode: 400 })
        done()
      })
  })

  it('should throw if Gale throws', done => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: { statusCode: 200 } })
    jest.spyOn(axios, 'put').mockRejectedValueOnce({ response: { data: 'ouch' } })

    spam
      .spam({})
      .then(() => done())
      .catch(error => {
        expect(error).toEqual('ouch')
        done()
      })
  })

  it('should resolve if Gigya/Gale resolve', done => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: { statusCode: 200 } })
    const putSpy = jest.spyOn(axios, 'put').mockResolvedValueOnce({ data: {} })

    spam.spam({ uid: 'USER_ID' }).then(() => {
      expect(putSpy).toHaveBeenCalledWith(`${GALE_URL}/GDILoyalty/v1.0/en/user/USER_ID/?lang=en`)
      done()
    })
  })

  it('should return response and call GET with correct params, defaults', done => {
    const getSpy = jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: { statusCode: 200 } })
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2018-01-01T12:00:00.000Z')
    jest.spyOn(axios, 'put').mockResolvedValueOnce({ data: 'LOYALTED' })

    spam
      .spam({})
      .then(response => {
        expect(response).toEqual('LOYALTED')

        expect(getSpy).toHaveBeenCalledWith('https://accounts.us1.gigya.com/accounts.setAccountInfo', {
          params: {
            data: JSON.stringify({
              addSource: 'DYN_CA_EN_ACC',
              email: {
                garage: {
                  isOptedIn: true,
                  originalDateJoined: '2018-01-01T12:00:00.000Z',
                  dateJoined: '2018-01-01T12:00:00.000Z',
                },
                dynamite: {
                  isOptedIn: true,
                  originalDateJoined: '2018-01-01T12:00:00.000Z',
                  dateJoined: '2018-01-01T12:00:00.000Z',
                },
                loyalty: {
                  isOptedIn: true,
                  originalDateJoined: '2018-01-01T12:00:00.000Z',
                  dateJoined: '2018-01-01T12:00:00.000Z',
                },
              },
              terms: false,
              loyalty: {
                hasAgreed: false,
                originalDateJoined: '2018-01-01T12:00:00.000Z',
                preferredBrand: 'dynamite',
                registrationBrand: 'dynamite',
                preferredCountry: 'CA',
                registrationCountry: 'CA',
              },
            }),
            profile: JSON.stringify({
              languages: 'en',
              locale: 'en_CA',
              country: 'CA',
            }),
            UID: undefined,
            httpStatusCodes: true,
            apiKey: process.env.GIGYA_KEY,
            secret: process.env.GIGYA_SECRET,
          },
        })

        done()
      })
      .catch(done)
  })

  it('should return response and call GET with correct params, CA lang', done => {
    const getSpy = jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: { statusCode: 200 } })
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2018-01-01T12:00:00.000Z')
    jest.spyOn(axios, 'put').mockResolvedValueOnce({ data: 'LOYALTED' })

    const options = {
      lang: 'ca',
      banner: 'dynamite',
      source: 'CREATE_DESKTOP_LOY',
      uid: 'USER_ID',
      hasAgreedTerms: true,
    }

    spam
      .spam(options)
      .then(response => {
        expect(response).toEqual('LOYALTED')

        expect(getSpy).toHaveBeenCalledWith('https://accounts.us1.gigya.com/accounts.setAccountInfo', {
          params: {
            data: JSON.stringify({
              addSource: 'DYN_CA_EN_ACC_CREATE_DESKTOP_LOY',
              email: {
                garage: {
                  isOptedIn: true,
                  originalDateJoined: '2018-01-01T12:00:00.000Z',
                  dateJoined: '2018-01-01T12:00:00.000Z',
                },
                dynamite: {
                  isOptedIn: true,
                  originalDateJoined: '2018-01-01T12:00:00.000Z',
                  dateJoined: '2018-01-01T12:00:00.000Z',
                },
                loyalty: {
                  isOptedIn: true,
                  originalDateJoined: '2018-01-01T12:00:00.000Z',
                  dateJoined: '2018-01-01T12:00:00.000Z',
                },
              },
              terms: true,
              loyalty: {
                hasAgreed: true,
                originalDateJoined: '2018-01-01T12:00:00.000Z',
                preferredBrand: 'dynamite',
                registrationBrand: 'dynamite',
                preferredCountry: 'CA',
                registrationCountry: 'CA',
              },
            }),
            profile: JSON.stringify({
              languages: 'en',
              locale: 'en_CA',
              country: 'CA',
            }),
            UID: 'USER_ID',
            httpStatusCodes: true,
            apiKey: process.env.GIGYA_KEY,
            secret: process.env.GIGYA_SECRET,
          },
        })

        done()
      })
      .catch(done)
  })

  it('should return response and call GET with correct params, FR lang', done => {
    const getSpy = jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: { statusCode: 200 } })
    const putSpy = jest.spyOn(axios, 'put').mockResolvedValueOnce({ data: 'LOYALTED' })
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2018-01-01T12:00:00.000Z')

    const options = {
      lang: 'fr-ca',
      banner: 'garage',
      source: 'CREATE_DESKTOP_LOY',
      uid: 'USER_ID',
      hasAgreedTerms: true,
    }

    spam
      .spam(options)
      .then(response => {
        expect(response).toEqual('LOYALTED')

        expect(putSpy).toHaveBeenCalledWith(`${GALE_URL}/GDILoyalty/v1.0/en/user/USER_ID/?lang=fr`)

        expect(getSpy).toHaveBeenCalledWith('https://accounts.us1.gigya.com/accounts.setAccountInfo', {
          params: {
            data: JSON.stringify({
              addSource: 'GAR_CA_FR_ACC_CREATE_DESKTOP_LOY',
              email: {
                garage: {
                  isOptedIn: true,
                  originalDateJoined: '2018-01-01T12:00:00.000Z',
                  dateJoined: '2018-01-01T12:00:00.000Z',
                },
                dynamite: {
                  isOptedIn: true,
                  originalDateJoined: '2018-01-01T12:00:00.000Z',
                  dateJoined: '2018-01-01T12:00:00.000Z',
                },
                loyalty: {
                  isOptedIn: true,
                  originalDateJoined: '2018-01-01T12:00:00.000Z',
                  dateJoined: '2018-01-01T12:00:00.000Z',
                },
              },
              terms: true,
              loyalty: {
                hasAgreed: true,
                originalDateJoined: '2018-01-01T12:00:00.000Z',
                preferredBrand: 'garage',
                registrationBrand: 'garage',
                preferredCountry: 'CA',
                registrationCountry: 'CA',
              },
            }),
            profile: JSON.stringify({
              languages: 'fr',
              locale: 'fr_CA',
              country: 'CA',
            }),
            UID: 'USER_ID',
            httpStatusCodes: true,
            apiKey: process.env.GIGYA_KEY,
            secret: process.env.GIGYA_SECRET,
          },
        })

        done()
      })
      .catch(done)
  })

  it('should return response and call GET with correct params, US lang', done => {
    const getSpy = jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: { statusCode: 200 } })
    const putSpy = jest.spyOn(axios, 'put').mockResolvedValueOnce({ data: 'LOYALTED' })
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2018-01-01T12:00:00.000Z')

    const options = {
      lang: 'us',
      banner: 'whatever?',
      source: 'CREATE_DESKTOP_LOY',
      uid: 'USER_ID',
      hasAgreedTerms: true,
    }

    spam
      .spam(options)
      .then(response => {
        expect(response).toEqual('LOYALTED')

        expect(putSpy).toHaveBeenCalledWith(`${GALE_URL}/GDILoyalty/v1.0/en/user/USER_ID/?lang=en`)

        expect(getSpy).toHaveBeenCalledWith('https://accounts.us1.gigya.com/accounts.setAccountInfo', {
          params: {
            data: JSON.stringify({
              addSource: 'DYN_US_EN_ACC_CREATE_DESKTOP_LOY',
              email: {
                garage: {
                  isOptedIn: true,
                  originalDateJoined: '2018-01-01T12:00:00.000Z',
                  dateJoined: '2018-01-01T12:00:00.000Z',
                },
                dynamite: {
                  isOptedIn: true,
                  originalDateJoined: '2018-01-01T12:00:00.000Z',
                  dateJoined: '2018-01-01T12:00:00.000Z',
                },
                loyalty: {
                  isOptedIn: true,
                  originalDateJoined: '2018-01-01T12:00:00.000Z',
                  dateJoined: '2018-01-01T12:00:00.000Z',
                },
              },
              terms: true,
              loyalty: {
                hasAgreed: true,
                originalDateJoined: '2018-01-01T12:00:00.000Z',
                preferredBrand: 'dynamite',
                registrationBrand: 'dynamite',
                preferredCountry: 'US',
                registrationCountry: 'US',
              },
            }),
            profile: JSON.stringify({
              languages: 'en',
              locale: 'en_US',
              country: 'US',
            }),
            UID: 'USER_ID',
            httpStatusCodes: true,
            apiKey: process.env.GIGYA_KEY,
            secret: process.env.GIGYA_SECRET,
          },
        })

        done()
      })
      .catch(done)
  })
})
