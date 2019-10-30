const axios = require('axios')
const { tryP } = require('fluture')
const { unlockCookieForDevelopment } = require('../utils/cookie')

const removeItemFromOrderRequest = ({ headers: { cookie }, body: { siteId, commerceItemId } }) =>
  tryP(() =>
    axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/CartFacade/removeItemFromOrder`,
      params: {
        siteId,
      },
      method: 'POST',
      headers: {
        Cookie: `${cookie}`,
      },
      data: {
        arg1: {
          class: 'com.gdi.to.services.cart.RemoveItemFromOrderTO',
          commerceItemId,
        },
      },
    })
  ).map(res => unlockCookieForDevelopment(res))

// removeItemFromOrder :: (HttpRequest, HttpResponse) -> Cancel
exports.removeItemFromOrder = (req, res) =>
  removeItemFromOrderRequest(req).fork(
    err => console.log(err) || res.status(500).json('Unexpected error'),
    ({ cookies, data }) =>
      res
        .set('Set-Cookie', cookies)
        .status(data.errors ? 401 : 200)
        .json(data)
  )
