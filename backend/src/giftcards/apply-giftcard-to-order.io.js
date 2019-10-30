const axios = require('axios')
const { tryP } = require('fluture')

const applyGiftCardToOrderRequest = ({
  headers: { cookie },
  body: { siteId, cardNumber, securityCode }
}) =>
  tryP(() =>
    axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/CheckoutFacade/applyGiftcard?siteId=${siteId}`,
      method: 'POST',
      headers: {
        Cookie: `${cookie}`
      },
      data: {
        arg1: {
          class: 'com.gdi.to.services.checkout.GiftcardTO',
          cardNumber,
          securityCode
        }
      }
    })
  ).map(({ data }) => data)

// applyGiftCardToOrder :: (HttpRequest, HttpResponse) -> Cancel
exports.applyGiftCardToOrder = (req, res) =>
  applyGiftCardToOrderRequest(req).fork(
    () => res.status(500).json('Unexpected error'),
    data => res.json(data)
  )
