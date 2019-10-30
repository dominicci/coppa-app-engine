const axios = require('axios')
const { tryP } = require('fluture')
const { unlockCookieForDevelopment } = require('../utils/cookie')

const createOrderToOptimalPaymentRequest = ({
  headers: { cookie },
  body: {
    firstName,
    lastName,
    address1,
    address2,
    city,
    country,
    state,
    postalCode,
    phoneNumber
  }
}) =>
  tryP(() =>
    axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/ProfileFacade/createOrderToOptimalPayment`,
      method: 'POST',
      headers: {
        Cookie: `${cookie}`
      },
      data: {
        arg1: {
          class: 'com.gdi.to.services.AddressTO',
          firstName,
          lastName,
          address1,
          address2,
          city,
          country,
          state,
          postalCode,
          phoneNumber
        }
      }
    })
  ).map(res => unlockCookieForDevelopment(res))

// createOrderToOptimalPayment :: (HttpRequest, HttpResponse) -> Cancel
exports.createOrderToOptimalPayment = (req, res) =>
  createOrderToOptimalPaymentRequest(req).fork(
    err => console.log(err) || res.status(500).json('Unexpected error'),
    ({ cookies, data }) => 
      res.set('Set-Cookie', cookies)
        .status(200)
        .json(data)
  )
