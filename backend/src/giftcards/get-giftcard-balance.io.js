const axios = require('axios')
const { tryP } = require('fluture')

const getGiftCardBalanceRequest = ({
  headers: { cookie },
  body: { siteId, cardNumber, securityCode }
}) =>
  tryP(() =>
    axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/CheckoutFacade/getGiftcardBalance?siteId=${siteId}`,
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

// getGiftCardBalance :: (HttpRequest, HttpResponse) -> Cancel
exports.getGiftCardBalance = (req, res) =>
  getGiftCardBalanceRequest(req).fork(
    () => res.status(500).json('Unexpected error'),
    data => res.json(data)
  )
