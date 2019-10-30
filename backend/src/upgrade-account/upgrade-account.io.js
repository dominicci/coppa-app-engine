const { get } = require('axios')
const { tryP } = require('fluture')
const { GIGYA_KEY, GIGYA_SECRET } = require('../config')
const { getBanner, getCountry, handleAxios } = require('../shared')
const { userWebhookReq } = require('../gale/user-webhook.io');

// upgradeAccountReq :: HttpRequest -> Future
const upgradeAccountReq = ({ query: { hasAgreedTerms, banner, language, uid } }) =>
  tryP(() =>
    get('https://accounts.us1.gigya.com/accounts.setAccountInfo',
      {
        params: {
          data: JSON.stringify({
            terms: !!hasAgreedTerms,
            loyalty: {
              hasAgreed: !!hasAgreedTerms,
              originalDateJoined: new Date().toISOString(),
              preferredBrand: getBanner(banner),
              registrationBrand: getBanner(banner),
              preferredCountry: getCountry(language),
              registrationCountry: getCountry(language),
            },
          }),
          UID: uid,
          httpStatusCodes: true,
          apiKey: GIGYA_KEY,
          secret: GIGYA_SECRET,
        },
      })
      .then(...handleAxios))
    .chain(() => userWebhookReq(uid))

// upgradeAccount :: (HttpRequest, HttpResponse) -> Cancel
exports.upgradeAccount = (req, res) =>
  upgradeAccountReq(req).fork(
    ({ code, error }) => res.status(code).json(error || 'Unexpected error'),
    success => res.json(success)
  )
