const axios = require('axios')
const { tryP } = require('fluture')
const { formatCartData } = require('./retrieve-order-summary')
const { unlockCookieForDevelopment } = require('../utils/cookie')

const retrieveOrderSummaryRequest = ({
  headers: { cookie },
  body: { siteId }
}) =>
  tryP(() =>
    axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/OrderFacade/retrieveOrderSummary?siteId=${siteId}`,
      method: 'POST',
      headers: {
        Cookie: `${cookie}`
      }
    })
  ).map(res => unlockCookieForDevelopment(res))

// retrieveOrderSummary :: (HttpRequest, HttpResponse) -> Cancel
exports.retrieveOrderSummary = (req, res) =>
  retrieveOrderSummaryRequest(req).fork(
    err => console.log(err) || res.status(500).json('Unexpected error'),
    ({ cookies, data }) =>
      res.set('Set-Cookie', cookies)
        .status( data.errors ? 401 : 200)
        .json(formatCartData(data))
  )
