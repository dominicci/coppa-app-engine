const axios = require('axios')
const { tryP } = require('fluture')
const { formatCartData } = require('./retrieve-cart-summary')
const { unlockCookieForDevelopment } = require('../utils/cookie')

const retrieveCartSummaryRequest = ({ body: { siteId }, headers: { cookie } }) =>
 tryP(() => axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/CartFacade/retrieveCartSummary?siteId=${siteId}`, 
      method: 'POST',
      headers: {
        Cookie: `${cookie}`
      }
  }))
  .map(res => unlockCookieForDevelopment(res))

// retrieveCartSummary :: (HttpRequest, HttpResponse) -> Cancel 
exports.retrieveCartSummary = (req, res) => 
  retrieveCartSummaryRequest(req).fork(
    err => console.log(err) || res.status(500).json('Unexpected error'),
    ({ cookies, data }) => 
      res.set('Set-Cookie', cookies)
        .status( data.errors ? 401 : 200)
        .json(formatCartData(data))
  )
  