const axios = require('axios')
const { tryP } = require('fluture')
const { unlockCookieForDevelopment } = require('../utils/cookie')

const duplicateOrderValidationRequest = ({
  headers: { cookie },
  body: { siteId }
}) =>
  tryP(() =>
    axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/OrderFacade/duplicateOrderValidation?siteId=${siteId}`,
      method: 'POST',
      headers: {
        Cookie: `${cookie}`
      }
    })
  ).map(res => unlockCookieForDevelopment(res))

// duplicateOrderValidation :: (HttpRequest, HttpResponse) -> Cancel
exports.duplicateOrderValidation = (req, res) =>
  duplicateOrderValidationRequest(req).fork(
    err => console.log(err) || res.status(500).json('Unexpected error'),
    ({ cookies, data }) => 
      res.set('Set-Cookie', cookies)
        .status(data.errors ? 401 : 200)
        .json(data)
  )
