const { get } = require('axios')
const { tryP } = require('fluture')
const { GIGYA_KEY, GIGYA_SECRET } = require('../../config')
const { handleAxios } = require('../../shared')

// fetch :: HttpRequest -> Future
const fetch = req =>
  tryP(() =>
    get('https://accounts.us1.gigya.com/accounts.setAccountInfo', {
      params: {
        data: JSON.stringify({ hasAgreedLoyalty11Terms: req.body.hasAgreedLoyalty11Terms }),
        UID: req.body.uid,
        httpStatusCodes: true,
        apiKey: GIGYA_KEY,
        secret: GIGYA_SECRET,
      },
    })
      .then(...handleAxios)
  )

// postTermsAndConditions :: (HttpRequest, HttpResponse) -> Cancel
exports.postTermsAndConditions = (req, res) =>
  fetch(req).fork(
    ({ code, error }) => res.status(code).json(error || 'Unexpected error'),
    success => res.json(success)
  )
