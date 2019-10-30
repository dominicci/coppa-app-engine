const welcomeEmail = require('../../exacttarget/welcome-email')
const event = require('../fixtures/newAccountEvent.fixture.json')

welcomeEmail.sendWelcomeEmail = jest.fn()
  .mockImplementationOnce(() => Promise.reject('NOT EMAILED'))
  .mockImplementation(() => Promise.resolve('EMAILED'))

// require after welcomeEmail is mocked
const { handleNewAccountEventWelcomeEmail } = require('./handle-new-account-welcome-email')

describe('Serverless - Handle New Account Event - Welcome Email', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('should publish with buffer', done => {
    handleNewAccountEventWelcomeEmail(event)
      .then(done.fail)
      .catch(res => {
        expect(res).toEqual('NOT EMAILED')
        expect(welcomeEmail.sendWelcomeEmail).toHaveBeenCalledWith({
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
    handleNewAccountEventWelcomeEmail(event).then(res => {
      expect(res).toEqual('EMAILED')
      expect(welcomeEmail.sendWelcomeEmail).toHaveBeenCalledWith({
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
