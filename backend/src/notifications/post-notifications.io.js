const { get } = require('axios')
const { tryP } = require('fluture')
const { GIGYA_KEY, GIGYA_SECRET } = require('../config')
const { handleAxios } = require('../shared')

// fetch :: HttpRequest -> Future
const fetch = req =>
  tryP(() =>
    get('https://accounts.us1.gigya.com/accounts.setAccountInfo', {
      params: {
        data: JSON.stringify({ notifications: req.body.notifications }),
        UID: req.body.uid,
        httpStatusCodes: true,
        apiKey: GIGYA_KEY,
        secret: GIGYA_SECRET,
      },
    })
      .then(...handleAxios)
  )
    .mapRej(err => ({ code: err.statusCode || 500, msg: err.errorMessage }))

// postStyleSurvey :: (HttpRequest, HttpResponse) -> Cancel
exports.postNotifications = (req, res) =>
  fetch(req).fork(
    ({ code, msg }) => res.status(code).json(msg || 'Unexpected error'),
    success => res.json(success)
  )
