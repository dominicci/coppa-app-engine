const axios = require('axios')
const { tryP } = require('fluture')
const { unlockCookieForDevelopment } = require('../utils/cookie')

const updateItemQuantityRequest = ({ headers: { cookie }, body: { skuId, commerceItemId, quantity, siteId } }) =>
  tryP(() =>
    axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/CartFacade/updateCart`,
      params: {
        siteId,
      },
      method: 'POST',
      headers: {
        Cookie: `${cookie}`,
      },
      data: {
        arg1: {
          class: 'com.gdi.to.services.cart.UpdateCartTO',
          skuId,
          commerceItemId,
          quantity,
        },
      },
    })
  ).map(res => unlockCookieForDevelopment(res))

// updateItemQuantity :: (HttpRequest, HttpResponse) -> Cancel
exports.updateItemQuantity = (req, res) =>
  updateItemQuantityRequest(req).fork(
    err => console.log(err) || res.status(500).json('Unexpected error'),
    ({ cookies, data }) =>
      res
        .set('Set-Cookie', cookies)
        .status(data.errors ? 401 : 200)
        .json(data)
  )
