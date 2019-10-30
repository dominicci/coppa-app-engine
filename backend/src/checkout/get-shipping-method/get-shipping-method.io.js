const axios = require('axios')
const { tryP } = require('fluture')
const { format } = require('./get-shipping-method')
const { unlockCookieForDevelopment } = require('../utils/cookie')

const getShippingMethodRequest = ({
  headers : { cookie },
  body: { country, postalCode, siteId, shippingTitle }
}) =>
  tryP(() =>
    axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/CheckoutFacade/getShippingMethod`,
      method: 'POST',
      headers: {
        Cookie: `${cookie}`
      },
      data: {
        arg1: {
          class: 'com.gdi.to.services.checkout.GetShippingMethodTO',
          country,
          postalCode,
          siteId
        }
      }
    })
  ).map(res => unlockCookieForDevelopment(res))
  .map(({ cookies, data }) => ({ cookies, data: format(shippingTitle)(data)}))


// getShippingMethod :: (HttpRequest, HttpResponse) -> Cancel
exports.getShippingMethod = (req, res) =>
  getShippingMethodRequest(req).fork(
    err => console.log(err) || res.status(500).json('Unexpected error'),
    ({ cookies, data }) => 
      res.set('Set-Cookie', cookies)
        .status( data.errors ? 401 : 200)
        .json(data)
  )