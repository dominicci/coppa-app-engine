const axios = require('axios')
const { tryP } = require('fluture')
const { unlockCookieForDevelopment } = require('../utils/cookie')

const addToCartRequest = ({ headers: { cookie }, body: { skuId, productId, multipleSuppliers, quantity, siteId } }) =>
  tryP(() =>
    axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/CartFacade/addItemToOrder?siteId=${siteId}`,
      method: 'POST',
      headers: {
        Cookie: `${cookie}`,
      },
      data: {
        arg1: {
          class: 'com.gdi.to.services.cart.AddItemToOrderTO',
          skuId,
          productId,
          multipleSuppliers,
          quantity,
          siteId
        },
      },
    })
  ).map(res => unlockCookieForDevelopment(res))

// addToCart :: (HttpRequest, HttpResponse) -> Cancel
exports.addToCart = (req, res) =>
  addToCartRequest(req).fork(
    err => console.log(err) || res.status(500).json('Unexpected error'),
    ({ cookies, data }) =>
      res
        .set('Set-Cookie', cookies)
        .status(data.errors ? 401 : 200)
        .json(data)
  )
