const axios = require('axios')
const { tryP } = require('fluture')
const { formatAddressData } = require('./set-billing-address')
const { unlockCookieForDevelopment } = require('../utils/cookie')

const setBillingAddressRequest = ({ headers: { cookie }, body }) =>
  tryP(() => {
    const formattedBody = formatAddressData(body)
    const siteId = body.siteId
    const postData = Object.assign({}, { class: 'com.gdi.to.services.AddressTO' }, formattedBody)

    console.log({
        data: {
            arg1: postData,
          }
    })

    return axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/CheckoutFacade/setBillingAddress?siteId=${siteId}`,
      method: 'POST',
      headers: {
        Cookie: `${cookie}`,
      },
      data: {
        arg1: postData,
      },
    })
  }).map(res => unlockCookieForDevelopment(res))

// setBillingAddress :: (HttpRequest, HttpResponse) -> Cancel
exports.setBillingAddress = (req, res) =>
  setBillingAddressRequest(req).fork(
    err => console.log(err) || res.status(500).json('Unexpected error'),
    ({ cookies, data }) =>
      res
        .set('Set-Cookie', cookies)
        .status(200)
        .json(data)
  )
