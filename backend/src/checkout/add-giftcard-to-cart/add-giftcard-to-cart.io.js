const axios = require('axios')
const { tryP } = require('fluture')
const { unlockCookieForDevelopment } = require('../utils/cookie')

const addGiftCardToCartRequest = ({
  headers: { cookie },
  body: {
    giftCardAmount,
    quantity,
    electronic,
    giftCardMessage,
    giftCardRecipient,
    giftCardRecipientEmail,
    giftCardSender,
    siteId,
  },
}) =>
  tryP(() =>
    axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/CartFacade/addGiftCardToOrder?siteId=${siteId}`,
      method: 'POST',
      headers: {
        Cookie: `${cookie}`,
      },
      data: {
        arg1: {
          class: 'com.gdi.to.services.cart.AddGiftCardToOrderTO',
          giftCardAmount,
          quantity,
          electronic,
          giftCardMessage,
          giftCardRecipient,
          giftCardRecipientEmail,
          giftCardSender,
          siteId,
        },
      },
    })
  ).map(res => unlockCookieForDevelopment(res))

// addGiftCardToCart :: (HttpRequest, HttpResponse) -> Cancel
exports.addGiftCardToCart = (req, res) =>
  addGiftCardToCartRequest(req).fork(
    err => console.log(err) || res.status(500).json('Unexpected error'),
    ({ cookies, data }) =>
      res
        .set('Set-Cookie', cookies)
        .status(data.errors ? 401 : 200)
        .json(data)
  )
