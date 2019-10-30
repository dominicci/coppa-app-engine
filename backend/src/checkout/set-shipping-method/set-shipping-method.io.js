const axios = require('axios')
const { tryP } = require('fluture')
const { unlockCookieForDevelopment } = require('../utils/cookie')

const setShippingMethodRequest = ({
  headers: { cookie },
  body: { shippingMethodId, siteId }
}) =>
  tryP(() =>
    axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/CheckoutFacade/setShippingMethod`,
      method: 'POST',
      headers: {
        Cookie: `${cookie}`
      },
      data: {
        arg1: {
          class: 'com.gdi.to.services.checkout.SetShippingMethodTO',
          shippingMethodId,
          siteId
        }
      }
    })
  ).map(res => unlockCookieForDevelopment(res))

// setShippingMethod :: (HttpRequest, HttpResponse) -> Cancel
exports.setShippingMethod = (req, res) =>
  setShippingMethodRequest(req).fork(
    err => console.log(err) || res.status(500).json('Unexpected error'),
    ({ cookies, data }) => 
      res.set('Set-Cookie', cookies)
        .status( data.errors ? 401 : 200)
        .json(data)
  )
