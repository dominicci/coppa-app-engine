const axios = require('axios')
const { getAccessToken } = require('./access-token')
const { getCountry, getLang, handleAxios } = require('../shared')

const frOrEn = lang => (getLang(lang) === 'fr-ca' ? 'FR' : 'EN')

// Refer to https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/messageDefinitionSends.htm
// Credits to Yiqin He!
exports.sendWelcomeEmail = ({ email, uid, lang }) =>
  getAccessToken()
    .then(({ accessToken }) =>
      axios
        .post('https://www.exacttargetapis.com/messaging/v1/messageDefinitionSends/key:Loyalty_0_Welcome/send',
          {
            To: {
              Address: email,
              SubscriberKey: uid,
              ContactAttributes: {
                SubscriberAttributes: {
                  Language: frOrEn(lang), // FR or EN
                  Country: getCountry(lang),
                  gigya_id: uid,
                },
              },
            },
            Options: {
              RequestType: 'ASYNC',
            },
          },
          {
            headers: {
              'Authorization': `bearer ${accessToken}`,
            },
          })
        .then(...handleAxios)
    )
