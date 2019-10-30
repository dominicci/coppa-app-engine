const axios = require('axios')
const { userStatusReq } = require('./user-status')
const { GALE_URL } = require('../../config')

const STATUS = require('../fixtures/status.fixture.json')
const STATUS_PROCESSED = require('../fixtures/status-processed.fixture.json')

describe('Serverless - Loyalty User Badges/VIP Status', () => {
  beforeEach(() => jest.resetAllMocks())

  it('should throw error if Gale throws, default lang and banner', done => {
    const spy = jest.spyOn(axios, 'get').mockRejectedValueOnce({ response: { data: 'Sorry, an unknown error has occurred' } })

    userStatusReq({ query: { uid: 'USER_ID' } })
      .then(() => jest.fail())
      .catch(error => {
        expect(error.error).toEqual('Sorry, an unknown error has occurred')
        expect(spy).toHaveBeenCalledWith(`${GALE_URL}/GDILoyalty/v1.0/en/user/USER_ID/status/`)

        done()
      })
  })

  it('should resolve if Gale resolves, fr-ca', done => {
    const spy = jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: STATUS })

    userStatusReq({ query: { uid: 'USER_ID', lang: 'fr-ca' } }).then(response => {
      expect(response).toEqual(STATUS_PROCESSED)
      expect(spy).toHaveBeenCalledWith(`${GALE_URL}/GDILoyalty/v1.0/fr/user/USER_ID/status/`)
      done()
    })
  })

  it('should resolve if Gale resolves, fr', done => {
    const spy = jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: STATUS })

    userStatusReq({ query: { uid: 'USER_ID', lang: 'fr' } }).then(response => {
      expect(response).toEqual(STATUS_PROCESSED)
      expect(spy).toHaveBeenCalledWith(`${GALE_URL}/GDILoyalty/v1.0/fr/user/USER_ID/status/`)
      done()
    })
  })
})
