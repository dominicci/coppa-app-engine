const spam = require('../../newsletter/spam')
const event = require('../fixtures/newAccountEvent.fixture.json')

spam.spam = jest.fn()
  .mockImplementationOnce(() => Promise.reject('NOT SPAMMED'))
  .mockImplementation(() => Promise.resolve('SPAMMED'))

// require after spam is mocked
const { handleNewAccountEventSpam } = require('./handle-new-account-spam')

describe('Serverless - Handle New Account Event - Spam', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('should publish with buffer', done => {
    handleNewAccountEventSpam(event)
      .then(done.fail)
      .catch(res => {
        expect(res).toEqual('NOT SPAMMED')
        expect(spam.spam).toHaveBeenCalledWith({
          banner: 'dynamite',
          email: 'mmassoud@garagee.info',
          hasAgreedTerms: 'true',
          lang: 'fr-ca',
          source: 'CREATE_DESKTOP_LOY',
          uid: '02994efeb677498f8fc0778437563686',
        })

        done()
      })
  })

  it('should publish with buffer', done => {
    handleNewAccountEventSpam(event).then(res => {
      expect(res).toEqual('SPAMMED')
      expect(spam.spam).toHaveBeenCalledWith({
        banner: 'dynamite',
        email: 'mmassoud@garagee.info',
        hasAgreedTerms: 'true',
        lang: 'fr-ca',
        source: 'CREATE_DESKTOP_LOY',
        uid: '02994efeb677498f8fc0778437563686',
      })

      done()
    })
  })
})
