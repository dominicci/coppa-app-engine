const axios = require('axios')
const { tryP } = require('fluture')
const { unlockCookieForDevelopment } = require('../utils/cookie')

const commitCreditCardOrderRequest = ({
  headers: { cookie },
  body: { paymentType, responseQueryString, ecommType, siteId },
}) =>
  tryP(() => {
    return axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/CheckoutFacade/commitOrder?siteId=${siteId}`,
      params: {
        siteId,
      },
      method: 'POST',
      headers: {
        Cookie: `${cookie}`,
      },
      data: {
        arg1: {
          class: 'com.gdi.to.services.checkout.CommitOrderTO',
          paymentType: paymentType.toUpperCase(),
          responseQueryString,
          ecommType,
        },
      },
    })
  }).map(res => unlockCookieForDevelopment(res))

// commitOrder :: (HttpRequest, HttpResponse) -> Cancel
exports.commitCreditCardOrder = (req, res) =>
  commitCreditCardOrderRequest(req).fork(
    err => console.log(err) || res.status(500).json('Unexpected error'),
    ({ cookies, data }) =>
      res
        .set('Set-Cookie', cookies)
        .status(200)
        .json(data)
  )
