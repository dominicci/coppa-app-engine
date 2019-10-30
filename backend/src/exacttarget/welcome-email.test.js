const axios = require('axios')
const { sendWelcomeEmail } = require('./welcome-email')

describe('Serverless - sendWelcomeEmail', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('should trigger welcome email with access token, fr-ca', done => {
    const postSpy = jest
      .spyOn(axios, 'post')
      // getAccessToken()
      .mockResolvedValueOnce({
        data: {
          accessToken: 'ACCESS_TOKEN',
          expiresIn: 3600,
        }
      })
      // sendWelcomeEmail()
      .mockResolvedValueOnce({ data: 'Email Sent :)' })

    const options = {
      email: 'mmassoud@dynamite.ca',
      uid: '81060613',
      lang: 'fr-ca',
    }

    sendWelcomeEmail(options)
      .then(res => {
        expect(postSpy.mock.calls.length).toEqual(2)
        expect(postSpy).toHaveBeenCalledWith('https://www.exacttargetapis.com/messaging/v1/messageDefinitionSends/key:Loyalty_0_Welcome/send',
          {
            To: {
              Address: options.email,
              SubscriberKey: options.uid,
              ContactAttributes: {
                SubscriberAttributes: {
                  Language: 'FR',
                  Country: 'CA',
                  gigya_id: options.uid,
                },
              },
            },
            Options: {
              RequestType: 'ASYNC',
            },
          },
          {
            headers: {
              'Authorization': 'bearer ACCESS_TOKEN',
            },
          })

        expect(res).toEqual('Email Sent :)')
        done()
      })
      .catch(done.fail)
  })

  it('should trigger welcome email with access token, us', done => {
    const postSpy = jest
      .spyOn(axios, 'post')
      // sendWelcomeEmail()
      .mockResolvedValueOnce({ data: 'Email Sent :)' })

    const options = {
      email: 'mmassoud@dynamite.ca',
      uid: '81060613',
      lang: 'us',
    }

    sendWelcomeEmail(options)
      .then(res => {
        // only 1, because accessToken was already issued
        expect(postSpy.mock.calls.length).toEqual(1)

        expect(postSpy).toHaveBeenCalledWith('https://www.exacttargetapis.com/messaging/v1/messageDefinitionSends/key:Loyalty_0_Welcome/send',
          {
            To: {
              Address: options.email,
              SubscriberKey: options.uid,
              ContactAttributes: {
                SubscriberAttributes: {
                  Language: 'EN',
                  Country: 'US',
                  gigya_id: options.uid,
                },
              },
            },
            Options: {
              RequestType: 'ASYNC',
            },
          },
          {
            headers: {
              'Authorization': 'bearer ACCESS_TOKEN',
            },
          })

        expect(res).toEqual('Email Sent :)')
        done()
      })
      .catch(done.fail)
  })
})
