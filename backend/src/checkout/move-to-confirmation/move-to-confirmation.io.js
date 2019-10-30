const axios = require('axios')
const { tryP } = require('fluture')
const { unlockCookieForDevelopment } = require('../utils/cookie')

const generateThreatMetrixSessionId = orderId =>
  `${process.env.THREAT_METRIX_ORG_ID}-${(d => d.getTime())(new Date())}-${orderId}`

const moveToConfirmationRequest = ({
  body: {
    paymentType,
    creditCardCvdNumber,
    saveCreditCard,
    savedCreditCardId,
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    country,
    postalCode,
    phoneNumber,
    siteId,
    orderId,
  },
  headers: { cookie },
}) =>
  tryP(() =>
    axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/CheckoutFacade/moveToConfirmation?siteId=${siteId}`,
      method: 'POST',
      headers: {
        Cookie: `${cookie}`,
      },
      data: {
        arg1: {
          class: 'com.gdi.to.services.checkout.MoveToConfirmationTO',
          threatMetrixSessionId: generateThreatMetrixSessionId(orderId),
          paymentType,
          creditCardCvdNumber,
          saveCreditCard,
          savedCreditCardId,
          billingAddress: {
            class: 'com.gdi.to.services.AddressTO',
            firstName,
            lastName,
            address1,
            address2,
            city,
            state,
            country,
            postalCode,
            phoneNumber,
          },
        },
      },
    })
  ).map(res => unlockCookieForDevelopment(res))

// moveToConfirmation :: (HttpRequest, HttpResponse) -> Cancel
exports.moveToConfirmation = (req, res) => {
  moveToConfirmationRequest(req).fork(
    err => console.log(err) || res.status(500).json('Unexpected error'),
    ({ cookies, data }) =>
      res
        .set('Set-Cookie', cookies)
        .status(data.errors ? 401 : 200)
        .json(data)
  )
}
