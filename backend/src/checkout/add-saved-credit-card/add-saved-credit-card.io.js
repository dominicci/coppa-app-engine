const axios = require('axios')
const { tryP } = require('fluture')
const { unlockCookieForDevelopment } = require('../utils/cookie')

// angelo was here 1975
const addSavedCreditCardRequest = ({
  headers : { cookie },
  body: { queryParams }
}) =>
  tryP(() =>
    axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/ProfileFacade/addSavedCreditCard`,
      method: 'POST',
      headers: {
        Cookie: `${cookie}`
      },
      data: {
        arg1: {
          class: 'com.gdi.to.services.profile.CreditCardTO',
          queryParams,
        }
      }
    })
  ).map(res => unlockCookieForDevelopment(res))

// addSavedCreditCard :: (HttpRequest, HttpResponse) -> Cancel
exports.addSavedCreditCard = (req, res) =>
  addSavedCreditCardRequest(req).fork(
    err => console.log(err) || res.status(500).json('Unexpected error'),
    ({ cookies, data }) => 
      res.set('Set-Cookie', cookies)
        .status(200)
        .json(data)
  )
