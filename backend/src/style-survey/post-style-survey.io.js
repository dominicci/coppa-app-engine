const { get } = require('axios')
const { tryP } = require('fluture')
const { userWebhookReq } = require('../gale/user-webhook.io')
const { GIGYA_KEY, GIGYA_SECRET } = require('../config')
const { handleAxios } = require('../shared')

// fetch :: HttpRequest -> Future
const fetch = req =>
  tryP(() =>
    get('https://accounts.us1.gigya.com/accounts.setAccountInfo',
      {
        params: {
          data: JSON.stringify({ style_survey: req.body.styleSurvey, profile: { completed: true } }),
          UID: req.body.uid,
          httpStatusCodes: true,
          apiKey: GIGYA_KEY,
          secret: GIGYA_SECRET,
        },
      })
      .then(...handleAxios))
    .chain(() => userWebhookReq(req.body.uid))

// postStyleSurvey :: (HttpRequest, HttpResponse) -> Cancel
exports.postStyleSurvey = (req, res) =>
  fetch(req).fork(
    ({ code, error }) => res.status(code).json(error || 'Unexpected error'),
    success => res.json(success)
  )
