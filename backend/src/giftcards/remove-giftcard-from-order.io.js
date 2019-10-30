const axios = require('axios')
const { tryP } = require('fluture')

const removeGiftCardFromOrderRequest = ({
  headers: { cookie },
  body: { siteId, paymentGroupId, cardNumber }
}) =>
  tryP(() =>
    axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/CheckoutFacade/removeGiftcard?siteId=${siteId}`,
      method: 'POST',
      headers: {
        Cookie: `${cookie}`
      },
      data: {
        arg1: {
          class: 'com.gdi.to.services.checkout.GiftcardTO',
          paymentGroupId,
          cardNumber
        }
      }
    })
  ).map(({ data }) => data)

// removeGiftCardFromOrder :: (HttpRequest, HttpResponse) -> Cancel
exports.removeGiftCardFromOrder = (req, res) =>
  removeGiftCardFromOrderRequest(req).fork(
    () => res.status(500).json('Unexpected error'),
    data => res.json(data)
  )
