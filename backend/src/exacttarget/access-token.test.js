const axios = require('axios')
const { getAccessToken } = require('./access-token')

// in ms
const startOf2018 = 1514764800000
const oneHour = 1000 * 60 * 60

describe('Serverless - getAccessToken', () => {
  const RealDate = Date

  beforeEach(() => {
    jest.restoreAllMocks()
    global.Date = RealDate
  })

  it('should issue a new token on the first time', done => {
    Date.now = jest.fn()
      // current time in isExpired()
      .mockReturnValueOnce(startOf2018)
      // setting issuedAt in getNewAccessToken()
      .mockReturnValueOnce(startOf2018)

    const spy = jest.spyOn(axios, 'post').mockResolvedValueOnce({
      data: {
        accessToken: 'ACCESS_TOKEN',
        expiresIn: 3600,
      },
    })

    getAccessToken()
      .then(res => {
        expect(spy).toHaveBeenCalled()
        expect(res).toEqual({
          accessToken: 'ACCESS_TOKEN',
          expiresIn: 3600,
          issuedAt: startOf2018 / 1000,
        })
        done()
      })
      .catch(done.fail)
  })

  it('should not issue a new token if previous one is not expired', done => {
    Date.now = jest.fn()
      // current time in isExpired()
      .mockReturnValueOnce(startOf2018)

    const spy = jest.spyOn(axios, 'post').mockResolvedValueOnce({
      data: {
        accessToken: 'ACCESS_TOKEN_2',
        expiresIn: 3600,
      },
    })

    getAccessToken()
      .then(res => {
        expect(spy).not.toHaveBeenCalled()

        expect(res).toEqual({
          accessToken: 'ACCESS_TOKEN',
          expiresIn: 3600,
          issuedAt: startOf2018 / 1000,
        })
        done()
      })
      .catch(done.fail)
  })

  it('should issue a new token if previous one is expired', done => {
    Date.now = jest.fn()
      // current time in isExpired()
      .mockReturnValueOnce(startOf2018 + oneHour)
      // setting issuedAt in getNewAccessToken()
      .mockReturnValueOnce(startOf2018 + oneHour)

    const spy = jest.spyOn(axios, 'post').mockResolvedValueOnce({
      data: {
        accessToken: 'ACCESS_TOKEN_2',
        expiresIn: 3600,
      }
    })

    getAccessToken()
      .then(res => {
        expect(spy).toHaveBeenCalled()

        expect(res).toEqual({
          accessToken: 'ACCESS_TOKEN_2',
          expiresIn: 3600,
          issuedAt: (startOf2018 + oneHour) / 1000,
        })
        done()
      })
      .catch(done.fail)
  })

  it('should issue a new token if previous one expired', done => {
    Date.now = jest.fn()
      // current time in isExpired()
      .mockReturnValueOnce(startOf2018 + oneHour + oneHour)
      // setting issuedAt in getNewAccessToken()
      .mockReturnValueOnce(startOf2018 + oneHour)

    const spy = jest
      .spyOn(axios, 'post')
      .mockRejectedValueOnce({
        response: {
          data: {
            documentation: 'https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/error-handling.htm',
            errorcode: 0,
            message: 'Not Authorized',
          }
        }
      })
      .mockResolvedValueOnce({
        data: {
          accessToken: 'ACCESS_TOKEN_3',
          expiresIn: 3600,
        }
      })

    getAccessToken()
      .then(res => {
        expect(spy).toHaveBeenCalled()

        expect(res).toEqual({
          accessToken: 'ACCESS_TOKEN_3',
          expiresIn: 3600,
          issuedAt: (startOf2018 + oneHour) / 1000,
        })
        done()
      })
      .catch(done.fail)
  })
})
