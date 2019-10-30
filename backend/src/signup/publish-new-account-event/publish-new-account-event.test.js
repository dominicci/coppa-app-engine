// mock Pubsub before importing it
const PubSubMock = require('../fixtures/pubsub.mock')
jest.doMock('@google-cloud/pubsub', () => PubSubMock.PubSub)

// needs to be imported after the mocks above
const { publishNewAccountEvent } = require('./publish-new-account-event')

describe('Serverless - Publish New Account Event', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should publish with buffer', done => {
    const spy = jest.spyOn(PubSubMock.Publisher.prototype, 'publish').mockResolvedValueOnce({ messageId: 'event-id' })

    const event = {
      email: 'mmassoud@dynamite.ca',
      uid: 81070613,
      banner: 'dynamite',
      source: 'CREATE_ACCOUNT_LOY',
      lang: 'fr-ca',
      hasAgreedTerms: true,
      // those will not get published
      password: 'uh-oh',
      topSecret: 'oh-la-la',
    }

    publishNewAccountEvent(event).then(res => {
      expect(res).toEqual({ messageId: 'event-id' })

      expect(spy).toHaveBeenCalledWith(
        Buffer.from(
          JSON.stringify({
            email: 'mmassoud@dynamite.ca',
            uid: 81070613,
            banner: 'dynamite',
            source: 'CREATE_ACCOUNT_LOY',
            lang: 'fr-ca',
            hasAgreedTerms: true,
          })
        )
      )

      done()
    })
  })
})
