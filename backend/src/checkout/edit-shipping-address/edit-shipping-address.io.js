const axios = require('axios')
const { tryP } = require('fluture')
const { formatAddressData } = require('./edit-shipping-address')
const { unlockCookieForDevelopment } = require('../utils/cookie')

const editShippingAddressRequest = ({ headers: { cookie }, body }) =>
  tryP(() => {
    const formattedBody = formatAddressData(body)
    const siteId = body.siteId
    const postData = Object.assign({}, {class: 'com.gdi.to.services.checkout.SetShippingAddressTO'}, formattedBody)

    return axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/CheckoutFacade/editShippingAddress?siteId=${siteId}`,
      method: 'POST',
      headers: {
        Cookie: `${cookie}`
      },
      data: {
        arg1 : postData
      }
    })
  }).map(res => unlockCookieForDevelopment(res))

// editShippingAddress :: (HttpRequest, HttpResponse) -> Cancel
exports.editShippingAddress = (req, res) =>
  editShippingAddressRequest(req).fork(
    err => console.log(err) || res.status(500).json('Unexpected error'),
    ({ cookies, data }) =>
      res.set('Set-Cookie', cookies)
        .status( data.errors ? 401 : 200)
        .json(data)
  )
