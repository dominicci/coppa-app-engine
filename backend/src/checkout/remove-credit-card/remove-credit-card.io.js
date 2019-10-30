const axios = require('axios')
const { tryP } = require('fluture')
const { unlockCookieForDevelopment } = require('../utils/cookie')

const removeCreditCardRequest = ({ headers: { cookie }, body: { key } }) =>
  tryP(() =>
    axios({
      url: `${process.env.ATG_URL}/rest/bean/gdi/commerce/services/ProfileFacade/removeSavedCreditCard`,
      method: 'POST',
      headers: {
        Cookie: `${cookie}`,
      },
      data: {
        arg1: {
          class: 'com.gdi.to.services.profile.RemoveSavedCardTO',
          key,
        },
      },
    })
  ).map(res => unlockCookieForDevelopment(res))

// removeCreditCard :: (HttpRequest, HttpResponse) -> Cancel
exports.removeCreditCard = (req, res) =>
removeCreditCardRequest(req).fork(
    err => console.log(err) || res.status(500).json('Unexpected error'),
    ({ cookies, data }) => res.set('Set-Cookie', cookies).json(data)
  )
